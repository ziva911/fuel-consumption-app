import api, { ApiRole } from "../Api/Api";
import EventRegistry from '../Api/EventRegistry';
import ICreateBrand from '../../../api/src/components/brand/dto/ICreateBrand';
import Brand from "../../../api/src/components/brand/brand.model";
import IUpdateBrand from '../../../api/src/components/brand/dto/IUpdateBrand';
import ICreateBrandModel from '../../../api/src/components/brand-model/dto/ICreateBrandModel';
import BrandModel from "../../../api/src/components/brand-model/brand-model.model";

export default class BrandModelService {

    public static getAllBrandsAndModels(role: ApiRole = 'user'): Promise<any[]> {
        return new Promise<any[]>(resolve => {
            api("get", "/brand", role)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve([]);
                    }
                    resolve(res.data as any[])
                })
        })
    }
    public static getBrandById(brandId: number): Promise<Brand | null> {
        return new Promise<Brand | null>(resolve => {
            api("get", `/brand/${brandId}`, 'administrator')
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as Brand)
                })
        })
    }

    public static getModelById(modelId: number): Promise<BrandModel | null> {
        return new Promise<BrandModel | null>(resolve => {
            api("get", `/brand/model/${modelId}`, 'administrator')
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as BrandModel)
                })
        })
    }
    public static addNewBrand(payload: ICreateBrand): Promise<Brand | null> {
        return new Promise<Brand | null>(resolve => {
            api("post", "/brand", 'administrator', payload)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as Brand)
                })
        })
    }
    public static editBrand(brandId: number, brand: IUpdateBrand): Promise<Brand | null> {
        return new Promise<Brand | null>(resolve => {
            api("put", `/brand/${brandId}`, 'administrator', brand)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as Brand)
                })
        })
    }

    public static addModelByBrandId(model: ICreateBrandModel): Promise<BrandModel | null> {
        return new Promise<BrandModel | null>(resolve => {
            api("post", `/model`, 'administrator', model)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as BrandModel)
                })
        })
    }

    public static attemptAddModelPhoto(newPhotoInfo: any, photo: File | null) {
        let payload = new FormData();
        payload.append('data', JSON.stringify(newPhotoInfo));
        if (photo) {
            payload.append('photo', photo)
        }
        return new Promise<any>(resolve => {
            api("post", `/model/${newPhotoInfo.brandModelId}/photo`, "administrator", payload)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as any)
                })
        })
    }
}