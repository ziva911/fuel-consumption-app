import * as mysql2 from "mysql2/promise";
import IModel from "../common/IModel.interface";
import IModelAdapterOptions from "../common/IModelAdapterOptions.interface";

export default abstract class BaseService<ReturnModel extends IModel> {
    private database: mysql2.Connection;

    constructor(db: mysql2.Connection) {
        this.database = db;
    }

    protected get db(): mysql2.Connection {
        return this.database;
    }

    abstract adaptToModel(
        data: any,
        options: Partial<IModelAdapterOptions>,
    ): Promise<ReturnModel>;

    protected async getAllFromTable(
        tableName: string,
        options: Partial<IModelAdapterOptions> = {
            loadChildren: true,
        },
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

    protected async getByIdFromTable(
        tableName: string,
        id: number,
        options: Partial<IModelAdapterOptions> = null,
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

    protected async getByFieldIdFromTable(
        tableName: string,
        fieldName: string = null,
        fieldValue: any = null,
        options: Partial<IModelAdapterOptions> = null,
    ): Promise<ReturnModel[]> {
        const items: ReturnModel[] = [];

        let sql: string = `SELECT * FROM ${tableName}`;

        if (fieldName) {
            sql = `${sql} WHERE ${fieldName} = ?;`
            if (fieldValue === null) {
                sql = `${sql} WHERE ${fieldName} IS NULL;`;
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
}
