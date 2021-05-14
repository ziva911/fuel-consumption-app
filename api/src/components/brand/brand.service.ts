import BrandModel from "./brand.model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import { ICreateBrand } from "./dto/ICreateBrand";
import { IUpdateBrand } from "./dto/IUpdateBrand";
import BrandModelModel from "../brand-model/brand-model.model";
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';

class BrandModelAdapterOptions implements IModelAdapterOptions {
    loadParent: boolean = false;
    loadChildren: boolean = true; // child brenda automobila su klase tipa model automobila
}
export default class BrandService extends BaseService<BrandModel> {

    async adaptToModel(
        data: any,
        options: Partial<BrandModelAdapterOptions>
    ): Promise<BrandModel> {
        const item: BrandModel = new BrandModel();
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
    private getModelsByBrandId(brandId: number): Promise<BrandModelModel[]> {
        return this.services.brandModelService.getAllByBrandId(brandId, { loadParent: false });
    }

    public async getAll(
        options: Partial<BrandModelAdapterOptions> = { loadChildren: true }
    ): Promise<BrandModel[]> {
        return this.getByFieldIdFromTable<BrandModelAdapterOptions>("brand", null, null, options);
    }

    public async getById(
        brandId: number,
        options: Partial<BrandModelAdapterOptions> = { loadChildren: true }
    ): Promise<BrandModel | null> {
        return super.getByIdFromTable("brand", brandId, options);
    }

    public async create(data: ICreateBrand): Promise<BrandModel | IErrorResponse> {
        return new Promise<BrandModel | IErrorResponse>((result) => {
            const sql: string = `
                INSERT
                    brand
                SET
                    brand_name = ?,
                    brand_logo = ?;`;

            this.db.execute(sql, [data.name, data.logo])
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

    public async update(brandId: number, data: IUpdateBrand): Promise<BrandModel | IErrorResponse> {
        return new Promise<BrandModel | IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    brand
                SET
                    brand_name = ?,
                    brand_logo = ?
                WHERE
                    brand_id = ?;`;

            this.db.execute(sql, [data.name, data.logo, brandId])
                .then(async res => {
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
    public async delete(brandId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = `
                DELETE FROM
                    brand
                WHERE
                    brand_id = ?;`;

            this.db.execute(sql, [brandId])
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