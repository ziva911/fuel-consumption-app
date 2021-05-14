import VehicleService from './vehicle.service';
import * as express from 'express';
import VehicleModel from './vehicle.model';
import { ICreateVehicle, ICreateVehicleSchemaValidator } from './dto/ICreateVehicle';
import { IUpdateVehicle, IUpdateVehicleSchemaValidator } from './dto/IUpdateVehicle';
import IErrorResponse from '../../common/IErrorResponse.interface';

export default class VehicleController {
    private vehicleService: VehicleService;

    constructor(vehicleService: VehicleService) {
        this.vehicleService = vehicleService;
    }

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.vehicleService.getAll());
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: VehicleModel | null = await this.vehicleService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;

        if (!ICreateVehicleSchemaValidator(item)) {
            res.status(400).send(ICreateVehicleSchemaValidator.errors);
            return;
        }


        const newCategory: VehicleModel | IErrorResponse = await this.vehicleService.create(item as ICreateVehicle);

        res.send(newCategory);
    }

    async updateById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        const categoryId = Number(req.params.id);

        if (categoryId <= 0) {
            res.status(400).send(["The category ID must be a numerical value larger than 0."]);
            return;
        }

        if (!IUpdateVehicleSchemaValidator(item)) {
            res.status(400).send(IUpdateVehicleSchemaValidator.errors);
            return;
        }


        const editedCategory: VehicleModel | IErrorResponse = await this.vehicleService.update(categoryId, item as IUpdateVehicle);

        res.send(editedCategory);
    }
    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const categoryId = Number(req.params.id);

        if (categoryId <= 0) {
            res.status(400).send(["The category ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.vehicleService.delete(categoryId));
    }
}