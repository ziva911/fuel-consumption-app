import FuelTypeModel from "./fuel-type.model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import { ICreateFuelType } from "./dto/ICreateFuelType";
import { IUpdateFuelType } from "./dto/IUpdateFuelType";

export default class BrandService extends BaseService<FuelTypeModel> {

    async adaptToModel(
        data: any,
    ): Promise<FuelTypeModel> {
        const item: FuelTypeModel = new FuelTypeModel();
        item.id = Number(data?.fuel_type_id);
        item.name = data?.name;
        return item;
    }

    public async getAll(): Promise<FuelTypeModel[]> {
        return this.getByFieldIdFromTable("fuel_type");
    }

    public async getById(id: number): Promise<FuelTypeModel | null> {
        return super.getByIdFromTable("fuel_type", id);
    }

    public async create(data: ICreateFuelType): Promise<FuelTypeModel | IErrorResponse> {
        return new Promise<FuelTypeModel | IErrorResponse>((result) => {
            const sql: string = `
                INSERT
                    fuel_type
                SET
                    name = ?`;

            this.db.execute(sql, [data.name])
                .then(async res => {
                    const resultData: any = { ...res };
                    const newFuelTypeId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newFuelTypeId));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async update(id: number, data: IUpdateFuelType): Promise<FuelTypeModel | IErrorResponse> {
        return new Promise<FuelTypeModel | IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    fuel_type
                SET
                    name = ?
                WHERE
                    fuel_type_id = ?;`;

            this.db.execute(sql, [data.name, id])
                .then(async res => {
                    result(await this.getById(id));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }
    public async delete(id: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = `
                DELETE FROM
                    fuel_type
                WHERE
                    fuel_type_id = ?;`;

            this.db.execute(sql, [id])
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