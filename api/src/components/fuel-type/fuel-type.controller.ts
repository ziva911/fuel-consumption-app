import * as express from 'express';
import FuelTypeModel from './fuel-type.model';
import { ICreateFuelType, ICreateFuelTypeSchemaValidator } from './dto/ICreateFuelType';
import { IUpdateFuelType, IUpdateFuelTypeSchemaValidator } from './dto/IUpdateFuelType';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';

export default class FuelTypeController extends BaseController {

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.services.fuelTypeService.getAll());
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
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

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;

        if (!ICreateFuelTypeSchemaValidator(item)) {
            res.status(400).send(ICreateFuelTypeSchemaValidator.errors);
            return;
        }

        const newFuelType: FuelTypeModel | IErrorResponse = await this.services.fuelTypeService.create(item as ICreateFuelType);

        res.send(newFuelType);
    }

    async updateById(req: express.Request, res: express.Response, next: express.NextFunction) {
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

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = Number(req.params.id);

        if (id <= 0) {
            res.status(400).send(["Invalid value for fuel type ID."]);
            return;
        }

        res.send(await this.services.fuelTypeService.delete(id));
    }
}