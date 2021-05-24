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

    async adaptToModel(
        data: any,
        options: Partial<UserAdapterOptions>
    ): Promise<User> {
        const item: User = new User();
        item.userId = Number(data?.user_id);
        item.username = data?.username;
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

    public async getAll(
        options: Partial<UserAdapterOptions> = { loadVerified: true }
    ): Promise<User[]> {
        return this.getAllFromTable<UserAdapterOptions>("user", options);
    }

    public async getById(
        userId: number,
        options: Partial<UserAdapterOptions> = { loadVerified: false }
    ): Promise<User | null> {
        return super.getByIdFromTable<UserAdapterOptions>("user", userId, options);
    }

    public async getUserByVerificationCode(
        verificationCode: string,
        options: Partial<UserAdapterOptions> = { loadVerified: true }
    ): Promise<User | IErrorResponse> {
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
                        ]).then(
                            async () => {
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

    public async create(data: ICreateUser, options: Partial<UserAdapterOptions> = { loadVerified: false }): Promise<User | IErrorResponse> {
        return new Promise<User | IErrorResponse>((result) => {

            const passwordHash = bcypt.hashSync(data.password, 12);

            const randomNameSegment = uuidv4();
            this.db.execute(`
                INSERT
                    user
                SET
                    username = ?,
                    password_hash = ?,
                    first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    currency = ?,
                    language = ?,
                    verification_code = ?;`,
                [
                    data.username,
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

    public async update(userId: number, data: IUpdateUser): Promise<User | IErrorResponse> {
        return new Promise<User | IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    user
                SET
                    password_hash = ?,
                    first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    currency = ?,
                    language = ?
                WHERE
                    user_id = ?;`;

            const passwordHash = bcypt.hashSync(data.password, 12);

            this.db.execute(`
                UPDATE
                    user
                SET
                    password_hash = ?,
                    first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    currency = ?,
                    language = ?
                WHERE
                    user_id = ?;`,
                [
                    passwordHash,
                    data.firstName,
                    data.lastName,
                    data.phoneNumber,
                    data.currency,
                    data.language,
                    userId
                ])
                .then(
                    async res => {
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

    public async delete(userId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = `
                DELETE FROM
                    user
                WHERE
                    user_id = ?;`;

            this.db.execute(sql, [userId])
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