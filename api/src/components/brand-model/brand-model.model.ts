import IModel from '../../common/IModel.interface';
import Brand from '../brand/brand.model';

export default class BrandModel implements IModel {
    id: number;
    name: string;
    brandId: number;
    brand: Brand | null = null;
};
