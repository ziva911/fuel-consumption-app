import IModel from '../../common/IModel.interface';
import BrandModel from '../brand/brand.model';

export default class BrandModelModel implements IModel {
    id: number;
    name: string;
    brandId: number;
    brand: BrandModel | null = null;
};