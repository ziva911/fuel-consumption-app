import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from "../../services/BaseService";
import { ICreateBrand } from "./dto/ICreateBrand";
import { IUpdateBrand } from "./dto/IUpdateBrand";
import Brand from "./brand.model";
import BrandModel from "../brand-model/brand-model.model";

class BrandAdapterOptions implements IModelAdapterOptions {
    loadParent: boolean = false;
    loadChildren: boolean = true; // Brand's "children" are classes BrandModel
}
export default class BrandService extends BaseService<Brand> {

    async adaptToModel(data: any, options: Partial<BrandAdapterOptions>): Promise<Brand> {
        const item: Brand = new Brand();
        item.id = Number(data?.brand_id);
        item.name = data?.brand_name;
        item.logo = data?.brand_logo;
        if (options.loadChildren) {
            item.models = [...await this.getModelsByBrandId(item.id)];
        }
        if (!options.loadChildren) {
            delete item.models;
        }
        return item;
    }

    private async getModelsByBrandId(brandId: number): Promise<BrandModel[]> {
        return this.services.brandModelService.getAllByBrandId(brandId, { loadParent: false });
    }

    async getAll(options: Partial<BrandAdapterOptions> = { loadChildren: true }): Promise<Brand[]> {
        return this.getAllFromTable<BrandAdapterOptions>("brand", options);
    }

    async getById(brandId: number, options: Partial<BrandAdapterOptions> = { loadChildren: true }): Promise<Brand | null> {
        return super.getByIdFromTable<BrandAdapterOptions>("brand", brandId, options);
    }

    async create(data: ICreateBrand): Promise<Brand | IErrorResponse> {
        return new Promise<Brand | IErrorResponse>((result) => {
            this.db.execute(`
                INSERT
                    brand
                SET
                    brand_name = ?,
                    brand_logo = ?;`,
                [
                    data.name,
                    data.logo
                ])
                .then(async res => {
                    const resultData: any = { ...res };
                    const newBrandId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newBrandId, { loadChildren: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async update(brandId: number, data: IUpdateBrand): Promise<Brand | IErrorResponse> {
        return new Promise<Brand | IErrorResponse>((result) => {

            this.db.execute(`
                UPDATE
                    brand
                SET
                    brand_name = ?,
                    brand_logo = ?
                WHERE
                    brand_id = ?;`,
                [
                    data.name,
                    data.logo, brandId
                ])
                .then(async _ => {
                    result(await this.getById(brandId, { loadChildren: true }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    async delete(brandId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            this.db.execute(`DELETE FROM brand WHERE brand_id = ?;`, [brandId])
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
