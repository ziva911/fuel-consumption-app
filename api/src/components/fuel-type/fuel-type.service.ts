import FuelTypeModel from "./fuel-type.model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import ICreateFuelType from "./dto/ICreateFuelType";
import IUpdateFuelType from "./dto/IUpdateFuelType";

export default class FuelTypeService extends BaseService<FuelTypeModel> {

    async adaptToModel(data: any): Promise<FuelTypeModel> {
        const item: FuelTypeModel = new FuelTypeModel();
        item.id = Number(data?.fuel_type_id);
        item.name = data?.name;
        return item;
    }

    async getAll(): Promise<FuelTypeModel[]> {
        return this.getByFieldIdFromTable("fuel_type");
    }

    async getById(id: number): Promise<FuelTypeModel | null> {
        return super.getByIdFromTable("fuel_type", id);
    }

    async create(data: ICreateFuelType): Promise<FuelTypeModel | IErrorResponse> {
        return new Promise<FuelTypeModel | IErrorResponse>((result) => {

            this.db.execute(`INSERT fuel_type SET name = ?;`, [data.name])
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

    async update(id: number, data: IUpdateFuelType): Promise<FuelTypeModel | IErrorResponse> {
        return new Promise<FuelTypeModel | IErrorResponse>((result) => {

            this.db.execute(`
                UPDATE
                    fuel_type
                SET
                    name = ?
                WHERE
                    fuel_type_id = ?;`,
                [
                    data.name,
                    id
                ])
                .then(async _ => {
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

    async delete(id: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {

            this.db.execute(`DELETE FROM fuel_type WHERE fuel_type_id = ?;`, [id])
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
