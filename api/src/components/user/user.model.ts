import IModel from "../../common/IModel.interface";

export default class UserModel implements IModel {
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    passwordHash: string;
    phoneNumber: string;
    currency: 'RSD' | 'EUR' | 'USD';
    language: 'SR' | 'EN';
};