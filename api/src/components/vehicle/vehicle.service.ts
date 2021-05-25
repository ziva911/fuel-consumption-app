
import * as path from 'path';
import * as rimraf from "rimraf";
import * as fs from 'fs';
import Config from '../../config/dev';
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { ICreateVehicle } from "./dto/ICreateVehicle";
import { IUpdateVehicle } from "./dto/IUpdateVehicle";
import { IUploadPhoto } from "../photo/dto/ICreatePhoto";
import BaseService from "../../services/BaseService";
import VehicleModel from "./vehicle.model";
import BrandModelModel from '../brand-model/brand-model.model';
import FuelTypeModel from '../fuel-type/fuel-type.model';
import Photo from "../photo/photo.model";

class VehicleModelAdapterOptions implements IModelAdapterOptions {
    loadParent: boolean = false;
    loadChildren: boolean = true; // vehicles "children" are classes BrandModel, FuelType & Photo
}
export default class VehicleService extends BaseService<VehicleModel> {

    async adaptToModel(data: any, options: Partial<VehicleModelAdapterOptions>): Promise<VehicleModel> {
        const item: VehicleModel = new VehicleModel();
        item.vehicleId = Number(data?.vehicle_id);
        item.internalName = data?.internal_name;
        item.manufactureYear = data?.manufacture_year;
        item.paintColor = data?.paint_color;
        item.mileageStart = Number(data?.mileage_start);
        item.mileageCurrent = Number(data?.mileage_current);
        item.createdAt = data?.created_at;
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

    async getAllByUserId(userId: number, options: Partial<VehicleModelAdapterOptions> = { loadChildren: true }): Promise<VehicleModel[]> {
        return this.getByFieldIdFromTable<VehicleModelAdapterOptions>("vehicle", "user_id", userId, options);
    }

    async getAll(options: Partial<VehicleModelAdapterOptions> = { loadChildren: true }): Promise<VehicleModel[]> {
        return this.getAllFromTable<VehicleModelAdapterOptions>("vehicle", options);
    }

    async getById(vehicleId: number, options: Partial<VehicleModelAdapterOptions> = { loadChildren: true }): Promise<VehicleModel | null> {
        return super.getByIdFromTable("vehicle", vehicleId, options);
    }

    async create(data: ICreateVehicle, uploadPhoto: IUploadPhoto): Promise<VehicleModel | IErrorResponse> {
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
                        ])
                        .then(
                            async (res: any) => {
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

                                Promise.all(promises)
                                    .then(() => {
                                        this.db.commit()
                                            .then(async () => {
                                                resolve(await this.getById(newVehicleId, { loadChildren: true }));
                                            }).catch(err => {
                                                resolve({
                                                    errorCode: err?.errno,
                                                    message: err?.sqlMessage,
                                                });
                                            });
                                    })
                                    .catch(err => {
                                        resolve({
                                            errorCode: err?.errno,
                                            message: err?.sqlMessage,
                                        });
                                    });
                            })
                        .catch(err => {
                            resolve({
                                errorCode: err?.errno,
                                message: err?.sqlMessage,
                            });
                        });
                })
                .catch(err => {
                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,

                    });
                });
        });
    }

    async update(vehicleId: number, data: IUpdateVehicle, uploadPhoto: IUploadPhoto): Promise<VehicleModel | IErrorResponse> {
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
                                }
                                else {
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
                                        })
                                        .catch(err => {
                                            resolve({
                                                errorCode: err?.errno,
                                                message: err?.sqlMessage,
                                            });
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

    async delete(vehicleId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            const currentVehicle = await this.getById(vehicleId, { loadChildren: true });
            let imagePathsToDelete = [];

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deleteVehicleRefuelHistory(vehicleId)) {
                        return;
                    }
                    throw {
                        errno: -100,
                        sqlMessage: 'Could not delete vehicle records in refuel history.',
                    };
                })
                .then(async () => {
                    const deletePhotos = await this.deleteVehiclePhotos(vehicleId);
                    if (deletePhotos === false) {
                        throw {
                            errno: -100,
                            sqlMessage: 'Could not delete vehicle photos. Files will not be deleted.',
                        };
                    }
                    imagePathsToDelete = deletePhotos;
                })
                .then(async () => {
                    const result = await this.deleteVehicleRecord(vehicleId);
                    if (result === true) {
                        return;
                    }
                    throw result;
                })
                .then(async () => {
                    await this.db.commit();
                })
                .then(() => {
                    for (const path of imagePathsToDelete) {
                        this.deletePhotoAndResizedVersions(path);
                    }
                    return true;
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        message: "Vehicle deleted.",
                    });
                })
                .catch(async err => {
                    await this.db.rollback();

                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    private async deleteVehicleRefuelHistory(vehicleId: number) {
        return new Promise<boolean>(async resolve => {
            this.db.execute(`DELETE FROM refuel_history WHERE vehicle_id = ?;`, [vehicleId])
                .then(
                    () => {
                        resolve(true);
                    }
                ).catch(
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    async deletePhotoByVehicleId(vehicleId: number): Promise<IErrorResponse | null> {
        return new Promise<IErrorResponse | null>(async resolve => {
            const [rows] = await this.db.execute(`SELECT image_path FROM photo WHERE vehicle_id = ?;`, [vehicleId]);

            if ((rows as any[])?.length) {
                const filesToDelete: string[] = (rows as any[]).map(row => row?.image_path as string);
                const imagePath = filesToDelete[0];
                this.db.execute(`DELETE FROM photo WHERE vehicle_id =?;`, [vehicleId])
                    .then(() => {
                        this.deletePhotoAndResizedVersions(imagePath);
                        resolve({
                            errorCode: 0,
                            message: 'Photo deleted',
                        });
                        return;
                    })
                    .catch(err => {
                        resolve({
                            errorCode: err?.errno,
                            message: err?.sqlMessage,
                        });
                        return;
                    });
            }
            resolve(null);
            return
        });
    }

    private async deleteVehiclePhotos(vehicleId: number): Promise<string[] | false> {
        return new Promise<string[] | false>(async resolve => {
            const [rows] = await this.db.execute(`SELECT image_path FROM photo WHERE vehicle_id = ?;`, [vehicleId]);

            if (!Array.isArray(rows) || rows.length === 0) {
                resolve([]);
                return;
            }

            const filesToDelete: string[] = (rows as any[]).map(row => row?.image_path as string);

            this.db.execute(`DELETE FROM photo WHERE vehicle_id = ?;`, [vehicleId])
                .then(() => { resolve(filesToDelete); })
                .catch(() => { resolve(false); });
        });
    }

    private async deleteVehicleRecord(vehicleId: number) {
        return new Promise<IErrorResponse | true>(resolve => {
            this.db.execute(`DELETE FROM vehicle WHERE vehicle_id = ?;`, [vehicleId])
                .then(() => { resolve(true); })
                .catch(err => {
                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    private async deletePhotoAndResizedVersions(imagePath: string) {
        try {
            // delete original image
            fs.unlinkSync(imagePath);
            // delete image resizings
            for (const resizeSpecification of Config.fileUploadOptions.photos.resizings) {
                const parsedFilename = path.parse(imagePath);
                const directory = parsedFilename.dir;
                const namePart = parsedFilename.name;
                const extPart = parsedFilename.ext;
                const resizedVersionsPath = directory + "/" + namePart + resizeSpecification.sufix + extPart;
                fs.unlinkSync(resizedVersionsPath);
            }
            // delete directory
            let parsedFileDir = path.parse(imagePath).dir;
            const configDir = Config.fileUploadOptions.uploadDestinationDirectory +
                (Config.fileUploadOptions.uploadDestinationDirectory.endsWith('/') ? '' : '/');
            parsedFileDir = parsedFileDir.replace(configDir, "");
            rimraf(configDir + parsedFileDir.split("/")[0], function () { console.log("Directory deleted."); });
        }
        catch (e) { }
    }

    async addVehiclePhoto(vehicleId: number, uploadPhoto: IUploadPhoto): Promise<VehicleModel | IErrorResponse | null> {
        return new Promise<VehicleModel | IErrorResponse | null>(resolve => {
            this.db.beginTransaction()
                .then(
                    () => {
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
                        Promise.all(promises)
                            .then(async () => { await this.db.commit(); })
                            .then(
                                async () => {
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
        });
    }
}
