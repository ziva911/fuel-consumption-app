import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import AdministratorModel from './administrator.model';
import { ICreateAdministrator } from './dto/ICreateAdministrator';
import * as bcypt from 'bcrypt';
import { IUpdateAdministrator } from './dto/IUpdateAdministrator';

class AdministratorModelAdapterOptions implements IModelAdapterOptions { }

export default class AdministratorService extends BaseService<AdministratorModel> {

    async adaptToModel(
        data: any,
        options: Partial<AdministratorModelAdapterOptions>
    ): Promise<AdministratorModel> {
        const item: AdministratorModel = new AdministratorModel();
        item.administratorId = Number(data?.administrator_id);
        item.username = data?.username;
        item.passwordHash = data?.password_hash;

        return item;
    }

    public async getAll(
        options: Partial<AdministratorModelAdapterOptions> = { loadChildren: true }
    ): Promise<AdministratorModel[]> {
        return this.getAllFromTable<AdministratorModelAdapterOptions>("administrator", options);
    }

    public async getById(
        adminId: number,
        options: Partial<AdministratorModelAdapterOptions> = { loadChildren: true }
    ): Promise<AdministratorModel | null> {
        return super.getByIdFromTable<AdministratorModelAdapterOptions>("administrator", adminId, options);
    }

    public async create(data: ICreateAdministrator): Promise<AdministratorModel | IErrorResponse> {
        return new Promise<AdministratorModel | IErrorResponse>((result) => {
            const sql: string = `
                INSERT
                    administrator
                SET
                    username = ?,
                    password_hash = ?;`;

            const passwordHash = bcypt.hashSync(data.password, 12);
            this.db.execute(sql, [data.username, passwordHash])
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

    public async update(adminId: number, data: IUpdateAdministrator): Promise<AdministratorModel | IErrorResponse> {
        return new Promise<AdministratorModel | IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    administrator
                SET
                    password_hash = ?
                WHERE
                    administrator_id = ?;`;

            const passwordHash = bcypt.hashSync(data.password, 12);

            this.db.execute(sql, [passwordHash, adminId])
                .then(async res => {
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

    public async delete(adminId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = `
                DELETE FROM
                    administrator
                WHERE
                    administrator_id = ?;`;

            this.db.execute(sql, [adminId])
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