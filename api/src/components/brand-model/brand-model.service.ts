import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import { ICreateBrandModel } from "./dto/ICreateBrandModel";
import { IUpdateBrandModel } from "./dto/IUpdateBrandModel";
import BrandModelModel from "./brand-model.model";
import BrandModel from "../brand/brand.model";
import BrandService from '../brand/brand.service';

export default class BrandModelService extends BaseService<BrandModelModel> {

    async adaptToModel(
        data: any,
        options: Partial<{ loadChildren: boolean }> = { loadChildren: true }
    ): Promise<BrandModelModel> {
        const item: BrandModelModel = new BrandModelModel();
        item.id = Number(data?.brand_model_id);
        item.name = data?.model_name;
        item.brandId = Number(data?.brand_id);

        if (options.loadChildren && item.brandId) {
            item.brand = await this.getBrandById(item.brandId);
            if (item.brand) {
                delete item.brandId;
            }
        }

        if (!options.loadChildren) {
            delete item.brand;
        }

        return item;
    }

    public async getBrandById(brandId: number): Promise<BrandModel | null> {
        const brandService = new BrandService(super.db);
        return brandService.getById(brandId);
    }

    public async getAllByBrandId(brandId): Promise<BrandModelModel[]> {
        return this.getByFieldIdFromTable("brand_model", "brand_id", brandId, { loadChildren: false });
    }

    public async getById(brandModelId: number): Promise<BrandModelModel | null> {
        return super.getByIdFromTable("brand_model", brandModelId, { loadChildren: true });
    }

    public async create(data: ICreateBrandModel): Promise<BrandModelModel | IErrorResponse> {
        return new Promise<BrandModelModel | IErrorResponse>((result) => {
            const sql: string = `
                INSERT
                    brand_model
                SET
                    model_name = ?,
                    brand_id = ?;`;

            this.db.execute(sql, [data.name, data.brandId])
                .then(async res => {
                    const resultData: any = { ...res };
                    const newModelId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newModelId));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async update(brandModelId: number, data: IUpdateBrandModel): Promise<BrandModelModel | IErrorResponse> {
        return new Promise<BrandModelModel | IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    brand_model
                SET
                    model_name = ?,
                    brand_id = ?
                WHERE
                    brand_model_id = ?;`;

            this.db.execute(sql, [data.name, data.brandId, brandModelId])
                .then(async res => {
                    result(await this.getById(brandModelId));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async delete(brandModelId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = `
                DELETE FROM
                    brand_model
                WHERE
                    brand_model_id = ?;`;

            this.db.execute(sql, [brandModelId])
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