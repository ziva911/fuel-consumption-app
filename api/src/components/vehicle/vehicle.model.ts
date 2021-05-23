import IModel from '../../common/IModel.interface';
import BrandModelModel from '../brand-model/brand-model.model';
import FuelTypeModel from '../fuel-type/fuel-type.model';

export default class VehicleModel implements IModel {
    vehicleId: number;
    internalName: string | null = null;
    userId: number;
    manufactureYear: number;
    paintColor: string | null = null;
    mileageStart: number;
    mileageCurrent: number;
    imagePath: string;
    fuelTypeId: number;
    fuelType: FuelTypeModel | null = null;
    brandModelId: number;
    brandModel: BrandModelModel | null = null;
    createdAt: Date; // YYYY-MM-DD HH:MM:SS.ffffff
    modifiedAt: Date;
};