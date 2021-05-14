import VehicleModel from "./vehicle.model";
import { ICreateVehicle } from "./dto/ICreateVehicle";
import { IUpdateVehicle } from "./dto/IUpdateVehicle";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";

export default class VehicleService extends BaseService<VehicleModel> {

    async adaptToModel(
        data: any,
    ): Promise<VehicleModel> {
        const item: VehicleModel = new VehicleModel();
        item.vehicleId = Number(data?.vehicle_id);
        item.internalName = data?.internal_name;
        item.manufactureYear = data?.manufacture_year;
        item.paintColor = data?.paint_color;
        item.mileageStart = Number(data?.mileage_start);
        item.mileageCurrent = Number(data?.mileage_current);
        item.imagePath = data?.image_path;
        item.fuelTypeId = Number(data?.fuel_type_id);
        item.brandModelId = Number(data?.brand_model_id);
        item.createdAt = data?.created_at; // YYYY-MM-DD HH:MM:SS.ffffff
        item.modifiedAt = data?.modified_at;
        return item;
    }

    public async getAll(): Promise<VehicleModel[]> {
        const vehicles: VehicleModel[] = [];
        const sql: string = "SELECT * FROM vehicle WHERE "
        // TODO
        return vehicles;
    }

    public async getById(vehicleId: number): Promise<VehicleModel | null> {
        return super.getByIdFromTable("vehicle", vehicleId);
    }

    public async create(data: ICreateVehicle): Promise<VehicleModel | IErrorResponse> {
        return new Promise<VehicleModel | IErrorResponse>((result) => {
            const sql: string = "INSERT vehicle SET name = ?, image_path = ?, parent__category_id = ?;";

            this.db.execute(sql, [data.name, data.imagePath, data.parentCategoryId ?? null])
                .then(async res => {
                    const resultData: any = res;
                    const newCategoryId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newCategoryId));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async update(vehicleId: number, data: IUpdateVehicle): Promise<VehicleModel | IErrorResponse> {
        return new Promise<VehicleModel | IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    vehicleId
                SET
                    name = ?,
                    image_path = ?,
                    parent__category_id = ?
                WHERE
                    category_id = ?;`;

            this.db.execute(sql, [data.name, data.imagePath, data.parentCategoryId ?? null, vehicleId])
                .then(async res => {
                    result(await this.getById(vehicleId));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }
    public async delete(vehicleId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = "DELETE FROM vehicle WHERE vehicle_id = ?;";

            this.db.execute(sql, [vehicleId])
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