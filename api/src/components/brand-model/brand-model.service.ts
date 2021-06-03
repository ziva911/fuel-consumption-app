import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import ICreateBrandModel from "./dto/ICreateBrandModel";
import IUpdateBrandModel from "./dto/IUpdateBrandModel";
import BrandModel from "./brand-model.model";
import Brand from "../brand/brand.model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import ICreatePhoto, { IUploadPhoto } from "../photo/dto/ICreatePhoto";
import Photo from '../photo/photo.model';
import { IUpdatePhoto } from "../photo/dto/IUpdatePhoto";

class BrandModelAdapterOptions implements IModelAdapterOptions {
    loadParent: boolean = true; // BrandModel's parent is Brand class
    loadChildren: boolean = false; // model automobila nema podkategorije
}
export default class BrandModelService extends BaseService<BrandModel> {

    async adaptToModel(data: any, options: Partial<BrandModelAdapterOptions> = {}): Promise<BrandModel> {
        const item: BrandModel = new BrandModel();
        item.id = Number(data?.brand_model_id);
        item.name = data?.model_name;
        item.brandId = Number(data?.brand_id);

        if (options?.loadParent && item.brandId) {
            item.brand = await this.getBrandById(item.brandId);
            if (item.brand) {
                delete item.brandId;
            }
        }

        if (!options?.loadParent) {
            delete item.brand;
        }

        return item;
    }

    private async getBrandById(brandId: number): Promise<Brand | null> {
        return this.services.brandService.getById(brandId, { loadChildren: false });
    }

    async getAllByBrandId(brandId: number, options: Partial<BrandModelAdapterOptions> = { loadParent: false }): Promise<BrandModel[]> {
        return super.getByFieldIdFromTable<BrandModelAdapterOptions>("brand_model", "brand_id", brandId, options);
    }

    async getById(brandModelId: number, options: Partial<BrandModelAdapterOptions>): Promise<BrandModel | null> {
        return super.getByIdFromTable("brand_model", brandModelId, options);
    }

    async create(data: ICreateBrandModel): Promise<BrandModel | IErrorResponse> {
        return new Promise<BrandModel | IErrorResponse>((result) => {

            this.db.execute(`
                INSERT
                    brand_model
                SET
                    model_name = ?,
                    brand_id = ?;`,
                [
                    data.name,
                    data.brandId
                ])
                .then(async res => {
                    const resultData: any = res;
                    const newModelId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newModelId, { loadParent: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async addModelPhoto(data: ICreatePhoto, uploadPhoto: IUploadPhoto): Promise<Photo | IErrorResponse | null> {
        return new Promise<Photo | IErrorResponse | null>(resolve => {
            this.db.beginTransaction()
                .then(() => {
                    this.db.execute(`
                                INSERT
                                    photo
                                SET
                                    image_path = ?,
                                    brand_model_id = ?,
                                    manufacture_year = ?,
                                    paint_color = ?;`,
                        [
                            uploadPhoto.imagePath,
                            data.brandModelId,
                            data.manufactureYear,
                            data.paintColor
                        ])
                        .then(
                            async (res: any) => {
                                const newPhotoId: number = (res[0]?.insertId) as number;
                                this.db.commit()
                                    .then(async () => {
                                        resolve(await this.services.photoService.getById(newPhotoId, { loadChildren: true }));
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
                        })
                })
                .catch(err => {
                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                })
        })


    }

    async updateModelPhoto(data: IUpdatePhoto, uploadPhoto: IUploadPhoto): Promise<Photo | IErrorResponse | null> {
        // check if there is any photo with req data to updata, and if not redirect to create.
        const photo = await this.services.photoService.getPhotoByBrandModelAndYearAndColor(data.brandModelId, data.manufactureYear, data.paintColor, { loadChildren: false });
        if (!photo) {
            return this.addModelPhoto(data as ICreatePhoto, uploadPhoto);
        }
        return new Promise<Photo | IErrorResponse | null>(resolve => {
            this.db.beginTransaction()
                .then(() => {
                    this.db.execute(`
                        UPDATE
                            photo
                        SET
                            image_path = ?
                        WHERE
                            photo_id = ?;`,
                        [
                            uploadPhoto.imagePath,
                            photo.id
                        ])
                        .then(
                            async _ => {
                                this.db.commit()
                                    .then(async () => {
                                        resolve(await this.services.photoService.getById(photo.id, { loadChildren: true }));
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
                        })
                })
                .catch(err => {
                    resolve({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                })
        })


    }

    async update(brandModelId: number, data: IUpdateBrandModel): Promise<BrandModel | IErrorResponse> {
        return new Promise<BrandModel | IErrorResponse>((result) => {

            this.db.execute(`
                UPDATE
                    brand_model
                SET
                    model_name = ?,
                    brand_id = ?
                WHERE
                    brand_model_id = ?;`,
                [
                    data.name,
                    data.brandId,
                    brandModelId
                ])
                .then(async res => {
                    result(await this.getById(brandModelId, { loadParent: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async delete(brandModelId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {

            this.db.execute(`DELETE FROM brand_model WHERE brand_model_id = ?;`, [brandModelId])
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
