import IModel from '../../common/IModel.interface';
import BrandModelModel from '../brand-model/brand-model.model';

export default class BrandModel implements IModel {
    id: number;
    name: string;
    logo: string;
    models: BrandModelModel[] | null = null;
};