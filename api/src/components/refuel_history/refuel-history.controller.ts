import { Request, Response } from 'express';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';
import VehicleModel from '../vehicle/vehicle.model';
import ICreateRefuelHistory, { ICreateRefuelHistorySchemaValidator } from './dto/ICreateRefuelHistory';
import IUpdateRefuelHistory, { IUpdateRefuelHistorySchemaValidator } from './dto/IUpdateRefuelHistory';
import RefuelHistory from './refuel-history.model';

export default class RefuelHistoryController extends BaseController {

    async getAll(req: Request, res: Response) {
        // administrator only - get all refuel history from db
        res.send(await this.services.refuelHistoryService.getAll());
    }

    async getAllByVehicleId(req: Request, res: Response) {
        const vehicleId: number = Number(req.params?.vid);
        if (vehicleId <= 0) {
            res.sendStatus(404);
            return;
        }
        let userId;
        if (req.authorized?.role === 'user') {
            userId = Number(req.authorized?.id);
            if (userId <= 0) {
                res.sendStatus(401);
                return;
            }
        }
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(vehicleId);

        if (vehicle == null) {
            res.status(404).send("Vehicle with that ID not found");
            return;
        }
        if (req.authorized?.role === 'user' && Number(vehicle.userId) !== userId) {
            res.status(401).send("Not your vehicle");
            return;
        }
        res.send(await this.services.refuelHistoryService.getByVehicleId(vehicleId));

    }

    async create(req: Request, res: Response) {
        const item = req.body as ICreateRefuelHistory;
        item.vehicleId = Number(req.params?.vid);
        if (item.vehicleId <= 0) {
            res.sendStatus(404);
            return;
        }
        if (!ICreateRefuelHistorySchemaValidator(item)) {
            res.status(400).send(ICreateRefuelHistorySchemaValidator.errors);
            return;
        }
        let userId;
        if (req.authorized?.role === 'user') {
            userId = Number(req.authorized?.id);
            if (userId <= 0) {
                res.sendStatus(401);
                return;
            }
        }
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(item.vehicleId);

        if (vehicle == null) {
            res.status(404).send("Vehicle with that ID not found");
            return;
        }
        if (req.authorized?.role === 'user' && Number(vehicle.userId) !== userId) {
            res.status(401).send("Not your vehicle");
            return;
        }
        const newRefuelHistory: RefuelHistory | IErrorResponse = await this.services.refuelHistoryService.create(item as ICreateRefuelHistory);
        // if (newRefuelHistory instanceof RefuelHistory) {
        //     if (newRefuelHistory.isFull) {
        //         await this.services.vehicleService.updateFuelExtra(vehicle.vehicleId, 0)
        //     } else {
        //         await this.services.vehicleService.updateFuelExtra(vehicle.vehicleId, vehicle.fuelExtra + newRefuelHistory.quantity)
        //     }
        // }
        res.send(newRefuelHistory);
    }

    async updateById(req: Request, res: Response) {
        const item = req.body;
        const refuelHistoryId = Number(req.params.id);
        const vehicleId = Number(req.params.vid);

        if (refuelHistoryId <= 0 || vehicleId <= 0) {
            res.status(400).send(["The ID must be a numerical value larger than 0."]);
            return;
        }

        if (!IUpdateRefuelHistorySchemaValidator(item)) {
            res.status(400).send(IUpdateRefuelHistorySchemaValidator.errors);
            return;
        }
        let userId;
        if (req.authorized?.role === 'user') {
            userId = Number(req.authorized?.id);
            if (userId <= 0) {
                res.sendStatus(401);
                return;
            }
        }
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(vehicleId);

        if (vehicle == null) {
            res.status(404).send("Vehicle with that ID not found");
            return;
        }
        if (req.authorized?.role === 'user' && Number(vehicle.userId) !== userId) {
            res.status(401).send("Not your vehicle");
            return;
        }

        const updatedRefuelHistory: IUpdateRefuelHistory | IErrorResponse = await this.services.refuelHistoryService.updateById(refuelHistoryId, item as IUpdateRefuelHistory);

        if (updatedRefuelHistory == null) {
            res.status(404).send("There is no record of refuel history with that ID");
            return;
        }

        res.send(updatedRefuelHistory);
    }

    async deleteById(req: Request, res: Response) {
        const refuelHistoryId = Number(req.params.id);
        const vehicleId = Number(req.params.vid);

        if (refuelHistoryId <= 0 || vehicleId <= 0) {
            res.status(400).send(["The ID must be a numerical value larger than 0."]);
            return;
        }

        let userId;
        if (req.authorized?.role === 'user') {
            userId = Number(req.authorized?.id);
            if (userId <= 0) {
                res.sendStatus(401);
                return;
            }
        }
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(vehicleId);

        if (vehicle == null) {
            res.status(404).send("Vehicle with that ID not found");
            return;
        }
        if (req.authorized?.role === 'user' && Number(vehicle.userId) !== userId) {
            res.status(401).send("Not your vehicle");
            return;
        }
        const deletedRecord = await this.services.refuelHistoryService.deleteById(refuelHistoryId);
        res.send(deletedRecord);
    }

    async deleteAllVehicleHistory(req: Request, res: Response) {
        const vehicleId = Number(req.params.vid);

        if (vehicleId <= 0) {
            res.status(400).send(["The ID must be a numerical value larger than 0."]);
            return;
        }
        let userId;
        if (req.authorized?.role === 'user') {
            userId = Number(req.authorized?.id);
            if (userId <= 0) {
                res.sendStatus(401);
                return;
            }
        }
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(vehicleId);

        if (vehicle == null) {
            res.status(404).send("Vehicle with that ID not found");
            return;
        }
        if (req.authorized?.role === 'user' && Number(vehicle.userId) !== userId) {
            res.status(401).send("Not your vehicle");
            return;
        }
        res.send(await this.services.refuelHistoryService.deleteAllByVehicleId(vehicleId));
    }
}
