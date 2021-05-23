import * as mysql2 from "mysql2/promise";
import IModel from "../common/IModel.interface";
import IModelAdapterOptions from "../common/IModelAdapterOptions.interface";
import IApplicationResources from '../common/IApplicationResources.interface';
import IServices from '../common/IServices.interface';

export default abstract class BaseService<ReturnModel extends IModel> {
    private resources: IApplicationResources;

    constructor(resource: IApplicationResources) {
        this.resources = resource;
    }

    protected get db(): mysql2.Connection {
        return this.resources.databaseConnection;
    }

    protected get services(): IServices {
        return this.resources.services;
    }

    abstract adaptToModel(
        data: any,
        options: Partial<IModelAdapterOptions>,
    ): Promise<ReturnModel>;

    protected async getAllFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
        options: Partial<AdapterOptions> = {},
    ): Promise<ReturnModel[]> {
        const items: ReturnModel[] = [];

        const sql: string = `SELECT * FROM ${tableName};`;
        const [rows, fields] = await this.db.execute(sql);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                items.push(
                    await this.adaptToModel(
                        row,
                        options,
                    )
                );
            }
        }

        return items;
    }

    protected async getByIdFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
        id: number,
        options: Partial<AdapterOptions> = {},
    ): Promise<ReturnModel | null> {
        const sql: string = `SELECT * FROM ${tableName} WHERE ${tableName}_id = ?;`;
        const [rows, fields] = await this.db.execute(sql, [id]);

        if (!Array.isArray(rows)) {
            return null;
        }

        if (rows.length == 0) {
            return null;
        }

        return await this.adaptToModel(
            rows[0],
            options,
        );
    }

    protected async getByFieldIdFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
        fieldName: string = null,
        fieldValue: any = null,
        options: Partial<AdapterOptions> = {},
    ): Promise<ReturnModel[]> {
        const items: ReturnModel[] = [];

        let sql: string = `SELECT * FROM ${tableName}`;

        if (fieldName) {
            if (fieldValue === null) {
                sql = `${sql} WHERE ${fieldName} IS NULL;`;
            } else {
                sql = `${sql} WHERE ${fieldName} = ?;`;
            }
        }

        const [rows, fields] = await this.db.execute(sql, [fieldValue]);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                items.push(
                    await this.adaptToModel(
                        row,
                        options,
                    )
                );
            }
        }

        return items;
    }

    protected async getOneByFieldsValueFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
        queryFields: { name: string, value: any }[] = [],
        options: Partial<AdapterOptions> = {},
    ): Promise<ReturnModel | null> {
        let sql = "";
        let queryValues: any[] = [];
        if (queryFields.length) {
            sql = `SELECT * FROM ${tableName} WHERE `;
            for (let i = 0; i < queryFields.length; i++) {
                const field = queryFields[i];
                if (i > 0) {
                    sql = `${sql} AND `;
                }
                if (field.value === null) {
                    sql = `${sql} ${field.name} IS NULL`;
                } else {
                    sql = `${sql} ${field.name} = ?`;
                    queryValues.push(field.value);
                }
            }
        }

        const [rows, fields] = await this.db.execute(sql, [...queryValues]);

        if (!Array.isArray(rows)) {
            return null;
        }

        if (rows.length == 0) {
            return null;
        }

        return await this.adaptToModel(
            rows[0],
            options,
        );
    }
}
