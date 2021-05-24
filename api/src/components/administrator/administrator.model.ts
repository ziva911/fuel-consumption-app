import IModel from "../../common/IModel.interface";

export default class Administrator implements IModel {
    administratorId: number;
    email: string;
    passwordHash: string;
};
