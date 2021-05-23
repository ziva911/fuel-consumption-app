import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import UserModel from './user.model';
import { ICreateUser } from './dto/ICreateUser';
import * as bcypt from 'bcrypt';
import { IUpdateUser } from './dto/IUpdateUser';

class UserModelAdapterOptions implements IModelAdapterOptions { }

export default class UserService extends BaseService<UserModel> {

    async adaptToModel(
        data: any,
        options: Partial<UserModelAdapterOptions>
    ): Promise<UserModel> {
        const item: UserModel = new UserModel();
        item.userId = Number(data?.user_id);
        item.username = data?.username;
        item.firstName = data?.first_name;
        item.lastName = data?.last_name;
        item.phoneNumber = data?.phone_number;
        item.passwordHash = data?.password_hash;
        item.currency = data?.currency;
        item.language = data?.language;

        return item;
    }

    public async getAll(
        options: Partial<UserModelAdapterOptions> = { loadChildren: true }
    ): Promise<UserModel[]> {
        return this.getAllFromTable<UserModelAdapterOptions>("user", options);
    }

    public async getById(
        userId: number,
        options: Partial<UserModelAdapterOptions> = { loadChildren: true }
    ): Promise<UserModel | null> {
        return super.getByIdFromTable<UserModelAdapterOptions>("user", userId, options);
    }

    public async create(data: ICreateUser): Promise<UserModel | IErrorResponse> {
        return new Promise<UserModel | IErrorResponse>((result) => {
            const sql: string = `
                INSERT
                    user
                SET
                    username = ?,
                    password_hash = ?,
                    first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    currency = ?,
                    language = ?;`;

            const passwordHash = bcypt.hashSync(data.password, 12);
            this.db.execute(sql, [data.username, passwordHash, data.firstName, data.lastName, data.phoneNumber, data.currency, data.language])
                .then(async res => {
                    const resultData: any = { ...res };
                    const newUserId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newUserId, { loadChildren: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async update(userId: number, data: IUpdateUser): Promise<UserModel | IErrorResponse> {
        return new Promise<UserModel | IErrorResponse>((result) => {
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

            this.db.execute(sql, [passwordHash, data.firstName, data.lastName, data.phoneNumber, data.currency, data.language, userId])
                .then(async res => {
                    result(await this.getById(userId, { loadChildren: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
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