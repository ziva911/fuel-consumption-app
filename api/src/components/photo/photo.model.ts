import IModel from '../../common/IModel.interface';

export default class Photo implements IModel {
    id: number;
    imagePath: string;
    brandModelId?: number;
    manufactureYear?: number;
    paintColor?: string;
};