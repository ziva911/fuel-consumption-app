import IModel from '../../common/IModel.interface';

export default class BrandModel implements IModel {
    id: number;
    name: string;
    logo: string;
};