import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import BaseService from "../../services/BaseService";
import RefuelHistory from './refuel-history.model';
import { ICreateRefuelHistory } from './dto/ICreateRefuelHistory';
import { IUpdateRefuelHistory } from './dto/IUpdateRefuelHistory';

class RefuelHistoryAdapterOptions implements IModelAdapterOptions { }

export default class RefuelHistoryService extends BaseService<RefuelHistory> {

    async adaptToModel(data: any, options: Partial<RefuelHistoryAdapterOptions>): Promise<RefuelHistory> {
        const item: RefuelHistory = new RefuelHistory();
        item.refuelHistoryId = Number(data?.refuel_history_id);
        item.date = new Date(data?.date);
        item.isFull = data?.is_full ? true : false;
        item.mileageCurrent = Number(data?.mileage_current);
        item.quantity = Number(data?.quantity);
        item.totalCost = Number(data?.total_cost);
        item.createdAt = new Date(data?.created_at);
        item.modifiedAt = new Date(data?.modified_at) || item.createdAt;

        return item;
    }

    async getByVehicleId(vehicleId: number, options: Partial<RefuelHistoryAdapterOptions> = { loadChildren: false }): Promise<RefuelHistory[]> {
        return this.getByFieldIdFromTableWithOrderBy<RefuelHistoryAdapterOptions>("refuel_history", "vehicle_id", vehicleId, "created_at", "DESC", options);
    }

    async getAll(options: Partial<RefuelHistoryAdapterOptions> = { loadChildren: false }): Promise<RefuelHistory[]> {
        return this.getAllFromTable<RefuelHistoryAdapterOptions>("refuel_history", options);
    }

    private async getById(refuelHistoryId: number, options: Partial<RefuelHistoryAdapterOptions> = { loadChildren: false }): Promise<RefuelHistory | null> {
        return super.getByIdFromTable("refuel_history", refuelHistoryId, options);
    }

    async create(data: ICreateRefuelHistory): Promise<RefuelHistory | IErrorResponse> {
        return new Promise<RefuelHistory | IErrorResponse>(async resolve => {
            let newRefuelRecord = null;
            this.db.beginTransaction()
                .then(async () => {
                    const result = await this.insertRefuelRecord(data);
                    if (result instanceof RefuelHistory) {
                        newRefuelRecord = result;
                        return;
                    }
                    if (result as IErrorResponse) {
                        throw {
                            errno: result.errorCode,
                            sqlMessage: result.message
                        };
                    }
                    throw {
                        errno: -100,
                        sqlMessage: 'Could not create new refuel history record.',
                    };
                })
                .then(async () => {
                    const result = await this.updateVehicleMileageCurrent(data.vehicleId, data.mileageCurrent);
                    if (result === false) {
                        throw {
                            errno: -100,
                            sqlMessage: 'Could not update vehicle current mileage.',
                        };
                    }
                })
                .then(async () => {
                    await this.db.commit();
                })
                .then(() => {
                    if (newRefuelRecord && newRefuelRecord instanceof RefuelHistory) {
                        resolve(newRefuelRecord);
                        return;
                    }
                    throw {
                        errno: -100,
                        sqlMessage: 'Could create new refuel record.',
                    };
                })
                .catch(async err => {
                    await this.db.rollback();

                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        })
    }

    private async updateVehicleMileageCurrent(vehicleId: number, mileageCurrent: number): Promise<IErrorResponse | false> {
        return this.services.vehicleService.updateVehicleMileageCurrent(vehicleId, mileageCurrent);
    }

    private async insertRefuelRecord(data: ICreateRefuelHistory): Promise<RefuelHistory | IErrorResponse> {
        return new Promise<RefuelHistory | IErrorResponse>((result) => {
            this.db.execute(`
                INSERT
                    refuel_history
                SET
                    date = ?,
                    quantity = ?,
                    total_cost = ?,
                    is_full = ?,
                    mileage_current = ?,
                    vehicle_id = ?;`,
                [
                    new Date(data.date),
                    data.quantity,
                    data.totalCost,
                    data.isFull,
                    data.mileageCurrent,
                    data.vehicleId
                ])
                .then(async res => {
                    const resultData: any = { ...res };
                    const newRefuelHistoryId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newRefuelHistoryId, { loadChildren: false }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });

    }

    async updateById(refuelHistoryId: number, data: IUpdateRefuelHistory): Promise<RefuelHistory | IErrorResponse> {
        return new Promise<RefuelHistory | IErrorResponse>((result) => {

            this.db.execute(`
                UPDATE
                    refuel_history
                SET
                    quantity = ?,
                    total_cost = ?,
                    is_full = ?
                WHERE
                    refuel_history_id = ?;`,
                [
                    data.quantity,
                    data.totalCost,
                    data.isFull,
                    refuelHistoryId
                ])
                .then(async _ => {
                    result(await this.getById(refuelHistoryId, { loadChildren: false }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async deleteById(refuelHistoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            this.db.execute(`DELETE FROM refuel_history WHERE refuel_history_id = ?;`, [refuelHistoryId])
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

    async deleteAllByVehicleId(vehicleId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            this.db.execute(`DELETE FROM refuel_history WHERE vehicle_id = ?;`, [vehicleId])
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
