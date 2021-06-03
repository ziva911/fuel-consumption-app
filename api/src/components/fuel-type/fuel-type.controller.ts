import { Request, Response } from 'express';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';
import FuelTypeModel from './fuel-type.model';
import ICreateFuelType, { ICreateFuelTypeSchemaValidator } from './dto/ICreateFuelType';
import IUpdateFuelType, { IUpdateFuelTypeSchemaValidator } from './dto/IUpdateFuelType';

export default class FuelTypeController extends BaseController {

    async getAll(req: Request, res: Response) {
        res.send(await this.services.fuelTypeService.getAll());
    }

    async getById(req: Request, res: Response) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: FuelTypeModel | null = await this.services.fuelTypeService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: Request, res: Response) {
        const item = req.body;

        if (!ICreateFuelTypeSchemaValidator(item)) {
            res.status(400).send(ICreateFuelTypeSchemaValidator.errors);
            return;
        }

        const newFuelType: FuelTypeModel | IErrorResponse = await this.services.fuelTypeService.create(item as ICreateFuelType);

        res.send(newFuelType);
    }

    async updateById(req: Request, res: Response) {
        const item = req.body;
        const id = Number(req.params.id);

        if (id <= 0) {
            res.status(400).send(["Invalid value for fuel type ID."]);
            return;
        }

        if (!IUpdateFuelTypeSchemaValidator(item)) {
            res.status(400).send(IUpdateFuelTypeSchemaValidator.errors);
            return;
        }

        const updatedFuelType: FuelTypeModel | IErrorResponse = await this.services.fuelTypeService.update(id, item as IUpdateFuelType);

        if (updatedFuelType == null) {
            res.status(404).send("There is no fuel type with that ID");
            return;
        }

        res.send(updatedFuelType);
    }

    async deleteById(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (id <= 0) {
            res.status(400).send(["Invalid value for fuel type ID."]);
            return;
        }

        res.send(await this.services.fuelTypeService.delete(id));
    }
}
