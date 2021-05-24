import IModel from "../../common/IModel.interface";
import VehicleModel from '../vehicle/vehicle.model';

export default class User implements IModel {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    currency: 'RSD' | 'EUR' | 'USD';
    language: 'SR' | 'EN';
    vehicles: VehicleModel[] | null = null;
    verified?: boolean;
    verificationCode?: string | null = null;
};
