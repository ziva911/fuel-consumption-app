import VehicleModel from "./vehicle.model";
import { ICreateVehicle } from "./dto/ICreateVehicle";
import { IUpdateVehicle } from "./dto/IUpdateVehicle";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import Photo from "../photo/photo.model";
import { IUploadPhoto } from "../photo/dto/ICreatePhoto";
import BrandModelModel from '../brand-model/brand-model.model';
import FuelTypeModel from '../fuel-type/fuel-type.model';

class VehicleModelAdapterOptions implements IModelAdapterOptions {
    loadParent: boolean = false;
    loadChildren: boolean = true; // child vozila automobila su klase tipa model brenda, vrsta goriva i photo
}
export default class VehicleService extends BaseService<VehicleModel> {

    async adaptToModel(
        data: any,
        options: Partial<VehicleModelAdapterOptions>
    ): Promise<VehicleModel> {
        const item: VehicleModel = new VehicleModel();
        item.vehicleId = Number(data?.vehicle_id);
        item.internalName = data?.internal_name;
        item.manufactureYear = data?.manufacture_year;
        item.paintColor = data?.paint_color;
        item.mileageStart = Number(data?.mileage_start);
        item.mileageCurrent = Number(data?.mileage_current);
        item.createdAt = data?.created_at; // YYYY-MM-DD HH:MM:SS.ffffff
        item.modifiedAt = data?.modified_at;
        item.userId = Number(data?.user_id);

        item.fuelTypeId = Number(data?.fuel_type_id);
        item.brandModelId = Number(data?.brand_model_id);
        if (options?.loadChildren) {
            let photo: Photo = null;
            photo = (await this.getPhotoByVehicleId(Number(item.vehicleId)))[0];
            if (!photo) {
                photo = (await this.getPhotoByBrandModelAndYearAndColor(item.brandModelId, item.manufactureYear, item.paintColor));
            }
            item.imagePath = photo ? photo.imagePath : null;
            if (item.brandModelId) {
                item.brandModel = await this.getBrandModelById(item.brandModelId);
                if (item.brandModel) {
                    delete item.brandModelId;
                }
            }
            if (item.fuelTypeId) {
                item.fuelType = await this.getFuelTypeById(item.fuelTypeId);
                if (item.fuelType) {
                    delete item.fuelTypeId;
                }
            }
        }

        return item;
    }

    private async getPhotoByVehicleId(vehicleId: number) {
        return this.services.photoService.getByVehicleId(vehicleId, { loadChildren: false });
    }

    private async getBrandModelById(brandModelId: number): Promise<BrandModelModel | null> {
        return this.services.brandModelService.getById(brandModelId, { loadParent: true })
    }

    private async getFuelTypeById(fuelTypeId: number): Promise<FuelTypeModel | null> {
        return this.services.fuelTypeService.getById(fuelTypeId);
    }

    private async getPhotoByBrandModelAndYearAndColor(brandModelId: number, manufactureYear: number, paintColor: string): Promise<Photo | null> {
        return this.services.photoService.getPhotoByBrandModelAndYearAndColor(brandModelId, manufactureYear, paintColor, { loadChildren: true });
    }

    public async getAllByUserId(
        userId: number,
        options: Partial<VehicleModelAdapterOptions> = { loadChildren: true }
    ): Promise<VehicleModel[]> {
        return this.getByFieldIdFromTable<VehicleModelAdapterOptions>("vehicle", "user_id", userId, options);
    }

    public async getById(
        vehicleId: number,
        options: Partial<VehicleModelAdapterOptions> = { loadChildren: true })
        : Promise<VehicleModel | null> {
        return super.getByIdFromTable("vehicle", vehicleId, options);
    }

    public async create(data: ICreateVehicle, uploadPhoto: IUploadPhoto): Promise<VehicleModel | IErrorResponse> {
        return new Promise<VehicleModel | IErrorResponse>((resolve) => {
            this.db.beginTransaction()
                .then(() => {
                    this.db.execute(`
                        INSERT
                            vehicle
                        SET
                            internal_name = ?,
                            manufacture_year = ?,
                            paint_color = ?,
                            mileage_start = ?,
                            mileage_current = ?,
                            fuel_type_id = ?,
                            brand_model_id = ?,
                            user_id = ?;`,
                        [
                            data.internalName,
                            data.manufactureYear,
                            data.paintColor,
                            data.mileageStart,
                            data.mileageStart,
                            data.fuelTypeId,
                            data.brandModelId,
                            data.userId
                        ],
                    )
                        .then(async (res: any) => {
                            const newVehicleId: number = (res[0]?.insertId) as number;
                            const promises = [];
                            if (uploadPhoto) {
                                promises.push(
                                    this.db.execute(`
                                    INSERT
                                        photo
                                    SET
                                        image_path = ?,
                                        vehicle_id = ?;`,
                                        [
                                            uploadPhoto.imagePath,
                                            newVehicleId
                                        ]
                                    )
                                );
                            }

                            Promise
                                .all(promises)
                                .then(() => {
                                    this.db.commit()
                                        .then(async () => {
                                            resolve(await this.getById(newVehicleId, { loadChildren: true }));
                                        });
                                })
                                .catch(err => {
                                    resolve({
                                        errorCode: err?.errno,
                                        message: err?.sqlMessage,
                                    });
                                })
                        })
                        .catch(err => {
                            resolve({
                                errorCode: err?.errno,
                                message: err?.sqlMessage,
                            });
                        })
                })
                .catch(err => {
                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,

                    });
                });
        });
    }
    public async update(vehicleId: number, data: IUpdateVehicle, uploadPhoto: IUploadPhoto): Promise<VehicleModel | IErrorResponse> {
        return new Promise<VehicleModel | IErrorResponse>(async (resolve) => {
            const currentVehicle = await this.getById(vehicleId, {
                loadChildren: true,
            });
            if (currentVehicle === null) {
                resolve(null);
                return;
            }
            this.db.beginTransaction()
                .then(() => {
                    this.db.execute(`
                        UPDATE
                            vehicle
                        SET
                            internal_name = ?,
                            paint_color = ?,
                            user_id = ?
                        WHERE
                            vehicle_id = ?;`,
                        [
                            data.internalName,
                            data.paintColor,
                            data.userId,
                            vehicleId
                        ])
                        .then(async () => {
                            const currentPhoto = (await this.getPhotoByVehicleId(vehicleId))[0];
                            const promises = [];
                            if (uploadPhoto) {
                                if (!currentPhoto) {
                                    promises.push(
                                        this.db.execute(`
                                            INSERT
                                                photo
                                            SET
                                                image_path = ?,
                                                vehicle_id = ?;`,
                                            [
                                                uploadPhoto[0].imagePath,
                                                vehicleId
                                            ]
                                        )
                                    );
                                } else {
                                    promises.push(
                                        this.db.execute(`
                                            UPDATE
                                                photo
                                            SET
                                                image_path = ?
                                            WHERE vehicle_id = ?;`,
                                            [
                                                uploadPhoto[0].imagePath,
                                                vehicleId
                                            ]
                                        )
                                    );
                                }
                            }

                            Promise
                                .all(promises)
                                .then(() => {
                                    this.db.commit()
                                        .then(async () => {
                                            resolve(await this.getById(vehicleId, { loadChildren: true }));
                                        });
                                })
                                .catch(err => {
                                    resolve({
                                        errorCode: err?.errno,
                                        message: err?.sqlMessage,
                                    });
                                })
                        })
                        .catch(err => {
                            resolve({
                                errorCode: err?.errno,
                                message: err?.sqlMessage,
                            });
                        })
                })
                .catch(err => {
                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,

                    });
                });
        });
    }
    // public async update(vehicleId: number, data: IUpdateVehicle): Promise<VehicleModel | IErrorResponse> {
    //     return new Promise<VehicleModel | IErrorResponse>((result) => {
    //         const sql: string = `
    //             UPDATE
    //                 vehicleId
    //             SET
    //                 name = ?,
    //                 image_path = ?,
    //                 parent__category_id = ?
    //             WHERE
    //                 category_id = ?;`;

    //         this.db.execute(sql, [data.name, data.imagePath, data.parentCategoryId ?? null, vehicleId])
    //             .then(async res => {
    //                 result(await this.getById(vehicleId));
    //             })
    //             .catch(err => {
    //                 result({
    //                     errorCode: err?.errno,
    //                     message: err?.sqlMessage,
    //                 });
    //             });
    //     });
    // }
    // public async delete(vehicleId: number): Promise<IErrorResponse> {
    //     return new Promise<IErrorResponse>((result) => {
    //         const sql: string = "DELETE FROM vehicle WHERE vehicle_id = ?;";

    //         this.db.execute(sql, [vehicleId])
    //             .then(async res => {
    //                 const data: any = res;
    //                 result({
    //                     errorCode: 0,
    //                     message: `Deleted ${data[0].affectedRows} rows.`,
    //                 });
    //             })
    //             .catch(err => {
    //                 result({
    //                     errorCode: err?.errno,
    //                     message: err?.sqlMessage,
    //                 });
    //             });
    //     });
    // }

    public async addVehiclePhoto(vehicleId: number, uploadPhoto: IUploadPhoto): Promise<VehicleModel | IErrorResponse | null> {
        return new Promise<VehicleModel | IErrorResponse | null>(resolve => {
            this.db.beginTransaction()
                .then(() => {
                    const promises = [];

                    promises.push(
                        this.db.execute(`
                            INSERT INTO
                                photo (vehicle_id, image_path)
                            VALUES
                                (?, ?)
                            ON DUPLICATE KEY UPDATE
                              image_path = VALUES(image_path);`,
                            [vehicleId, uploadPhoto.imagePath]
                        ));
                    Promise
                        .all(promises)
                        .then(async () => {
                            await this.db.commit();
                        })
                        .then(async () => {
                            resolve(await this.getById(vehicleId, {
                                loadChildren: true
                            }));
                        })
                        .catch(async err => {
                            await this.db.rollback();

                            resolve({
                                errorCode: err?.errno,
                                message: err?.sqlMessage,
                            });
                        });
                });
        })
    }
}