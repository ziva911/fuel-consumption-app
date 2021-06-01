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
    fuelExtra: number;
    fuelTypeId: number | null = null;
    fuelType: FuelTypeModel | null = null;
    brandModelId: number | null = null;
    brandModel: BrandModelModel | null = null;
    createdAt: Date;
    modifiedAt: Date;
};
