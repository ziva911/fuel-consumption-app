import { Request, Response, NextFunction } from 'express';
import { ICreateUser, ICreateUserSchemaValidator } from './dto/ICreateUser';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';
import UserModel from './user.model';
import { IUpdateUserSchemaValidator, IUpdateUser } from './dto/IUpdateUser';

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

        const item: UserModel | null = await this.services.userService.getById(id);

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

        const newAdmin: UserModel | IErrorResponse = await this.services.userService.create(item as ICreateUser);

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

        const updatedAdmin: UserModel | IErrorResponse = await this.services.userService.update(userId, item as IUpdateUser);

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
}