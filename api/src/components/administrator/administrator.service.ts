import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import Administrator from './administrator.model';
import { ICreateAdministrator } from './dto/ICreateAdministrator';
import * as bcypt from 'bcrypt';
import { IUpdateAdministrator } from './dto/IUpdateAdministrator';

class AdministratorAdapterOptions implements IModelAdapterOptions { }

export default class AdministratorService extends BaseService<Administrator> {

    async adaptToModel(data: any, opt: Partial<AdministratorAdapterOptions>): Promise<Administrator> {
        const item: Administrator = new Administrator();
        item.administratorId = Number(data?.administrator_id);
        item.email = data?.administrator_email;
        item.passwordHash = data?.password_hash;

        return item;
    }

    async getAll(options: Partial<AdministratorAdapterOptions> = { loadChildren: true }): Promise<Administrator[]> {
        return this.getAllFromTable<AdministratorAdapterOptions>("administrator", options);
    }

    async getById(adminId: number, options: Partial<AdministratorAdapterOptions> = { loadChildren: true }): Promise<Administrator | null> {
        return super.getByIdFromTable<AdministratorAdapterOptions>("administrator", adminId, options);
    }

    async getByEmail(email: string, options: Partial<AdministratorAdapterOptions> = {}): Promise<Administrator | null> {
        const result = await super.getByFieldIdFromTable<AdministratorAdapterOptions>('administrator', 'administrator_email', email, options);
        if (!Array.isArray(result) || result.length === 0) {
            return null;
        }
        return result[0];
    }

    async create(data: ICreateAdministrator): Promise<Administrator | IErrorResponse> {
        return new Promise<Administrator | IErrorResponse>((result) => {

            const passwordHash = bcypt.hashSync(data.password, 12);

            this.db.execute(`
                INSERT
                    administrator
                SET
                    administrator_email = ?,
                    password_hash = ?;`,
                [
                    data.email,
                    passwordHash
                ])
                .then(async res => {
                    const resultData: any = { ...res };
                    const newAdminId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newAdminId, { loadChildren: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async update(adminId: number, data: IUpdateAdministrator): Promise<Administrator | IErrorResponse> {
        return new Promise<Administrator | IErrorResponse>((result) => {

            const passwordHash = bcypt.hashSync(data.password, 12);

            this.db.execute(`
                UPDATE
                    administrator
                SET
                    password_hash = ?
                WHERE
                    administrator_id = ?;`,
                [
                    passwordHash,
                    adminId
                ])
                .then(async _ => {
                    result(await this.getById(adminId, { loadChildren: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async delete(adminId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            this.db.execute(`DELETE FROM administrator WHERE administrator_id = ?;`, [adminId])
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
