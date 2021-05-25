import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import User from './user.model';
import { ICreateUser } from './dto/ICreateUser';
import * as bcypt from 'bcrypt';
import { IUpdateUser } from './dto/IUpdateUser';
import { v4 as uuidv4 } from 'uuid';

class UserAdapterOptions implements IModelAdapterOptions {
    loadVerified?: boolean = false;
}

export default class UserService extends BaseService<User> {

    async adaptToModel(data: any, options: Partial<UserAdapterOptions>): Promise<User> {
        const item: User = new User();
        item.userId = Number(data?.user_id);
        item.email = data?.user_email;
        item.firstName = data?.first_name;
        item.lastName = data?.last_name;
        item.phoneNumber = data?.phone_number;
        item.passwordHash = data?.password_hash;
        item.currency = data?.currency;
        item.language = data?.language;

        if (options?.loadVerified) {
            item.verified = data?.verified ? true : false;
            item.verificationCode = data?.verification_code as string;
        } else {
            delete item.verificationCode;
            delete item.verified;
        }

        return item;
    }

    async getAll(options: Partial<UserAdapterOptions> = { loadVerified: true }): Promise<User[]> {
        return this.getAllFromTable<UserAdapterOptions>("user", options);
    }

    async getById(userId: number, options: Partial<UserAdapterOptions> = { loadVerified: false }): Promise<User | null> {
        return super.getByIdFromTable<UserAdapterOptions>("user", userId, options);
    }

    async getUserByVerificationCode(verificationCode: string, options: Partial<UserAdapterOptions> = { loadVerified: true }): Promise<User | IErrorResponse> {
        return new Promise<User | IErrorResponse>((result) => {
            this.getOneByFieldsValueFromTable<UserAdapterOptions>("user", [{ name: "verification_code", value: verificationCode }], options)
                .then(res => {
                    if (res.verified) {
                        result({
                            errorCode: -1,
                            message: "This user is already verified",
                        });
                        return;
                    }
                    this.db.execute(`
                        UPDATE
                            user
                        SET
                            verified = ?
                        WHERE
                            user_id = ?;`,
                        [
                            true,
                            res.userId
                        ])
                        .then(
                            async _ => {
                                result(await this.getById(res.userId));
                            })
                        .catch(
                            err => {
                                result({
                                    errorCode: err?.errno,
                                    message: err?.sqlMessage,
                                });
                            }
                        );
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        })
    }

    async getByEmail(email: string, options: Partial<UserAdapterOptions> = { loadVerified: true }): Promise<User | null> {
        const result = await super.getByFieldIdFromTable<UserAdapterOptions>('user', 'user_email', email, options);
        if (!Array.isArray(result) || result.length === 0) {
            return null;
        }
        return result[0];
    }

    async create(data: ICreateUser, options: Partial<UserAdapterOptions> = { loadVerified: false }): Promise<User | IErrorResponse> {
        return new Promise<User | IErrorResponse>((result) => {

            const passwordHash = bcypt.hashSync(data.password, 12);

            const randomNameSegment = uuidv4();
            this.db.execute(`
                INSERT
                    user
                SET
                    user_email = ?,
                    password_hash = ?,
                    first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    currency = ?,
                    language = ?,
                    verification_code = ?;`,
                [
                    data.email,
                    passwordHash,
                    data.firstName,
                    data.lastName,
                    data.phoneNumber,
                    data.currency,
                    data.language,
                    randomNameSegment
                ])
                .then(
                    async res => {
                        const resultData: any = { ...res };
                        const newUserId: number = Number(resultData[0]?.insertId);
                        result(await this.getById(newUserId, { loadVerified: true }));
                    })
                .catch(
                    err => {
                        result({
                            errorCode: err?.errno,
                            message: err?.sqlMessage,
                        });
                    }
                );
        });
    }

    async update(userId: number, data: IUpdateUser): Promise<User | IErrorResponse> {
        return new Promise<User | IErrorResponse>((result) => {

            const passwordHash = bcypt.hashSync(data.password, 12);

            this.db.execute(`
                UPDATE
                    user
                SET
                    password_hash = ?,
                    first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    language = ?
                WHERE
                    user_id = ?;`,
                [
                    passwordHash,
                    data.firstName,
                    data.lastName,
                    data.phoneNumber,
                    data.language,
                    userId
                ])
                .then(
                    async _ => {
                        result(await this.getById(userId));
                    }
                )
                .catch(
                    err => {
                        result({
                            errorCode: err?.errno,
                            message: err?.sqlMessage,
                        });
                    }
                );
        });
    }

    async delete(userId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {

            this.db.execute(`DELETE FROM user WHERE user_id = ?;`, [userId])
                .then(async res => {
                    const data: any = res;
                    result({
                        errorCode: 0,
                        message: `Deleted ${data[0].affectedRows} rows.`,
                    });
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }
}
