import IModel from "../../common/IModel.interface";

export default class Administrator implements IModel {
    administratorId: number;
    username: string;
    passwordHash: string;
};