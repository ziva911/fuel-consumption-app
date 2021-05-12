import VehicleService from './service';
import * as express from 'express';
import VehicleModel from './model';
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
        const vehicle: VehicleModel | null = await this.vehicleService.getById(id);
        if (vehicle == null) {
            res.sendStatus(404);
            return;
        }
        res.send(vehicle);
    }
}