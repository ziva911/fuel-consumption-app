import IModel from '../../common/IModel.interface';

export default class RefuelHistory implements IModel {
    refuelHistoryId: number;
    date: Date;
    quantity: number;
    totalCost: number;
    isFull: boolean;
    mileageCurrent: number;
    createdAt: Date;
    modifiedAt: Date | null = null;
};