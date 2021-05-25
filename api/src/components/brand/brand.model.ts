import IModel from '../../common/IModel.interface';
import BrandModel from '../brand-model/brand-model.model';

export default class Brand implements IModel {
    id: number;
    name: string;
    logo: string;
    models: BrandModel[] | null = null;
};
