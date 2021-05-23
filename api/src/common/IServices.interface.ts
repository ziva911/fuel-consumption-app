import BrandService from '../components/brand/brand.service';
import BrandModelService from '../components/brand-model/brand-model.service';
import FuelTypeService from '../components/fuel-type/fuel-type.service';
import PhotoService from '../components/photo/photo.service';
import VehicleService from '../components/vehicle/vehicle.service';

export default interface IServices {
    brandService: BrandService,
    brandModelService: BrandModelService,
    fuelTypeService: FuelTypeService,
    photoService: PhotoService,
    vehicleService: VehicleService,
}