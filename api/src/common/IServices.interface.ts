import BrandService from '../components/brand/brand.service';
import BrandModelService from '../components/brand-model/brand-model.service';
import FuelTypeService from '../components/fuel-type/fuel-type.service';
import AdministratorService from '../components/administrator/administrator.service';
import UserService from '../components/user/user.service';
import PhotoService from '../components/photo/photo.service';
import VehicleService from '../components/vehicle/vehicle.service';
import RefuelHistoryService from '../components/refuel_history/refuel-history.service';

export default interface IServices {
    brandService: BrandService,
    brandModelService: BrandModelService,
    fuelTypeService: FuelTypeService,
    photoService: PhotoService,
    vehicleService: VehicleService,
    administratorService: AdministratorService,
    userService: UserService,
    refuelHistoryService: RefuelHistoryService
}
