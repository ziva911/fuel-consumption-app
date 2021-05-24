import { Request, Response, NextFunction } from 'express';
import { ICreateUser, ICreateUserSchemaValidator } from './dto/ICreateUser';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';
import User from './user.model';
import { IUpdateUserSchemaValidator, IUpdateUser } from './dto/IUpdateUser';
import * as nodemailer from 'nodemailer';
import Config from '../../config/dev';
import Mail = require('nodemailer/lib/mailer');

export default class UserController extends BaseController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.userService.getAll());
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: User | null = await this.services.userService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const item = req.body;

        if (!ICreateUserSchemaValidator(item)) {
            res.status(400).send(ICreateUserSchemaValidator.errors);
            return;
        }

        const newAdmin: User | IErrorResponse = await this.services.userService.create(item as ICreateUser);

        res.send(newAdmin);
    }

    async updateById(req: Request, res: Response, next: NextFunction) {
        const item = req.body;
        const userId = Number(req.params.id);

        if (userId <= 0) {
            res.status(400).send(["The user ID must be a numerical value larger than 0."]);
            return;
        }

        if (!IUpdateUserSchemaValidator(item)) {
            res.status(400).send(IUpdateUserSchemaValidator.errors);
            return;
        }

        const updatedAdmin: User | IErrorResponse = await this.services.userService.update(userId, item as IUpdateUser);

        if (updatedAdmin == null) {
            res.status(404).send("The user with that id does not exist");
            return;
        }

        res.send(updatedAdmin);
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.params.id);

        if (userId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.services.userService.delete(userId));
    }

    private async sendRegistrationMail(userData: User): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            const transport = nodemailer.createTransport(
                {
                    host: Config.mail.hostname,
                    port: Config.mail.port,
                    secure: Config.mail.secure,
                    auth: {
                        user: Config.mail.username,
                        pass: Config.mail.password
                    },
                    debug: Config.mail.debug
                },
                {
                    from: Config.mail.fromEmail
                }

            );

            const mailOptions: Mail.Options = {
                to: userData.email,
                subject: "Account registration",
                html: `
                <!doctype html>
                    <head>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <p>
                            Dear ${userData.firstName} ${userData.lastName}, <br>
                            <button type=“button”><a href="${Config.server.domain}/api/user/register/verification/${userData.verificationCode}"”>Click here to verify your account.</a></button>
                        </p>
                    </body>
                </html>`,
            };

            const closeTransportAndResolve = async (data: IErrorResponse) => {
                transport.close();
                resolve(data);
            }

            transport.sendMail(mailOptions)
                .then(() => {
                    closeTransportAndResolve({
                        errorCode: 0,
                        message: ""
                    })
                })
                .catch(err => {
                    closeTransportAndResolve({
                        errorCode: -1,
                        message: err?.message
                    });

                })
        })
    }

    private async sendVerificationMail(userData: User): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            const transport = nodemailer.createTransport(
                {
                    host: Config.mail.hostname,
                    port: Config.mail.port,
                    secure: Config.mail.secure,
                    auth: {
                        user: Config.mail.username,
                        pass: Config.mail.password
                    },
                    debug: Config.mail.debug
                },
                {
                    from: Config.mail.fromEmail
                }

            );

            const mailOptions: Mail.Options = {
                to: userData.email,
                subject: "Account verified",
                html: `
                <!doctype html>
                    <head>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <p>
                            Dear ${userData.firstName} ${userData.lastName}, <br>
                            Your account is successfullu verified.
                            You can login now.
                        </p>
                    </body>
                </html>`,
            };

            const closeTransportAndResolve = async (data: IErrorResponse) => {
                transport.close();
                resolve(data);
            }

            transport.sendMail(mailOptions)
                .then(() => {
                    closeTransportAndResolve({
                        errorCode: 0,
                        message: ""
                    })
                })
                .catch(err => {
                    closeTransportAndResolve({
                        errorCode: -1,
                        message: err?.message
                    });

                })
        })
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        const item = req.body;

        if (!ICreateUserSchemaValidator(item)) {
            res.status(400).send(ICreateUserSchemaValidator.errors);
            return;
        }

        const result: User | IErrorResponse = await this.services.userService.create(item as ICreateUser, { loadVerified: true });

        if (!(result instanceof User)) {
            if (result.message.includes("uq_user_user_email")) {
                return res.status(400).send({
                    errorCode: result.errorCode,
                    message: "An account already exists with that email"
                });
            }
            if (result.message.includes("uq_user_phone_number")) {
                return res.status(400).send({
                    errorCode: result.errorCode,
                    message: "An account already exists with that phone number."
                });
            }
            return res.status(400).send(result);
        }
        const mailSent: IErrorResponse = await this.sendRegistrationMail(result);
        if (mailSent.errorCode !== 0) {
            console.log("Register email could not be sent. Error: " + mailSent.message);
        }
        delete result.verificationCode;
        delete result.verified;
        delete result.passwordHash;
        res.send(result);
    }

    public async registerVerification(req: Request, res: Response, next: NextFunction) {
        const userVerificationCode = req.params?.id;

        if (!userVerificationCode) {
            res.sendStatus(404);
            return;
        }

        const result: User | IErrorResponse = await this.services.userService.getUserByVerificationCode(userVerificationCode as string, { loadVerified: true });

        if (!(result instanceof User)) {
            if (result?.errorCode) {
                return res.status(400).send(result);
            }
            return res.status(404).send({ message: "Wrong verification id. Check again the email we sent you." });
        } else {
            // TODO redirection to login page
            const mailSent: IErrorResponse = await this.sendVerificationMail(result);
            if (mailSent.errorCode !== 0) {
                console.log(`"Verified" email could not be sent. Error: ` + mailSent.message);
            }

            return res.send(result);
        }



    }
}
