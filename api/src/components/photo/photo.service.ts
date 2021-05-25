import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import { ICreatePhoto } from "./dto/ICreatePhoto";
import { IUpdatePhoto } from "./dto/IUpdatePhoto";
import Photo from "./photo.model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";

class PhotoAdapterOptions implements IModelAdapterOptions {
    loadChildren: boolean = false;
}
export default class PhotoService extends BaseService<Photo> {


    async adaptToModel(data: any, options: Partial<PhotoAdapterOptions> = {}): Promise<Photo> {
        const item: Photo = new Photo();
        item.id = Number(data?.photo_id);
        item.imagePath = data?.image_path;

        if (options?.loadChildren) {
            item.brandModelId = Number(data?.brand_model_id);
            item.manufactureYear = Number(data?.manufacture_year);
            item.paintColor = data?.paint_color;
        }

        return item;
    }


    async getById(photoId: number, options: Partial<PhotoAdapterOptions>): Promise<Photo | null> {
        return super.getByIdFromTable("photo", photoId, options);
    }

    async getByVehicleId(vehicleId: number, options: Partial<PhotoAdapterOptions>): Promise<Photo[]> {
        return super.getByFieldIdFromTable("photo", "vehicle_id", vehicleId, options);
    }

    async getPhotoByBrandModelAndYearAndColor(brandModelId: number, manufactureYear: number, paintColor: string, options = { loadChildren: false }): Promise<Photo | null> {
        let queryFields: { name: string, value: any }[] = [];
        queryFields.push({ name: "brand_model_id", value: brandModelId });
        queryFields.push({ name: "manufacture_year", value: manufactureYear });
        queryFields.push({ name: "paint_color", value: paintColor });
        return super.getOneByFieldsValueFromTable("photo", queryFields, options);
    }
}
