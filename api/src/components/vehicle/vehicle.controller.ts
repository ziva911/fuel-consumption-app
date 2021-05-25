import { Request, Response } from 'express';
import VehicleModel from './vehicle.model';
import { ICreateVehicle, ICreateVehicleSchemaValidator } from './dto/ICreateVehicle';
import { IUpdateVehicle, IUpdateVehicleSchemaValidator } from './dto/IUpdateVehicle';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';

export default class VehicleController extends BaseController {

    async getAll(req: Request, res: Response) {
        // administrator only - get all vehicles in db
        res.send(await this.services.vehicleService.getAll({ loadChildren: true }));
    }

    async getAllByUserId(req: Request, res: Response) {
        // parse data from req
        let userId;
        if (req.authorized?.role === 'user') {
            userId = Number(req.authorized?.id);
            if (!userId) {
                res.sendStatus(401);
                return;
            }
        }
        if (req.authorized?.role === 'administrator') {
            userId = Number(req.params?.uid);
            if (!userId) {
                res.sendStatus(404);
                return;
            }
        }

        // return all vehicles owned by user with that ID
        res.send(await this.services.vehicleService.getAllByUserId(userId, { loadChildren: true }));
    }

    async getById(req: Request, res: Response) {
        // parse data from req
        const vehicleId: number = Number(req.params?.id);
        if (!vehicleId) {
            res.sendStatus(404);
            return;
        }
        // find vehicle in db and check if it is owned by current user
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(vehicleId, { loadChildren: true });
        if (vehicle == null) {
            res.sendStatus(404);
            return;
        }
        if (req.authorized?.role === 'user' && Number(vehicle.userId) !== Number(req.authorized?.id)) {
            res.sendStatus(404);
            return;
        }
        res.send(vehicle);
    }

    async create(req: Request, res: Response) {
        // parse data from req
        let uploadPhoto = null;
        if (req.files && Object.keys(req.files).length) {
            uploadPhoto = await this.getUploadPhotos(req, res);
        }
        const itemString = req.body?.data as string;
        const item = JSON.parse(itemString);
        // get info about user
        if (req.authorized?.role === "user") {
            item.userId = req.authorized?.id
        }
        if (req.authorized?.role === "administrator") {
            item.userId = req.params?.uid
        }

        // validate req and insert into database
        if (!ICreateVehicleSchemaValidator(item)) {
            res.status(400).send(ICreateVehicleSchemaValidator.errors);
            return;
        }
        const newVehicle: VehicleModel | IErrorResponse = await this.services.vehicleService.create(item as ICreateVehicle, uploadPhoto);
        res.send(newVehicle);
    }

    async addVehiclePhoto(req: Request, res: Response) {
        // parse data from req
        const vehicleId: number = +(req.params?.id);
        if (vehicleId <= 0) {
            res.sendStatus(404);
            return;
        }

        //find vehicle in db and check if it is own by current user
        const vehicle = await this.services.vehicleService.getById(vehicleId, { loadChildren: true });
        if (vehicle == null) {
            res.sendStatus(404);
            return;
        }
        if (req.authorized?.role === "user" && vehicle.userId !== Number(req.authorized?.id)) {
            res.status(401).send("This vehicle does not belong to you.");
            return;
        }

        //upload photo and its path into db
        const uploadPhotos = await this.getUploadPhotos(req, res);
        if (uploadPhotos.length === 0) {
            return;
        }
        res.send(await this.services.vehicleService.addVehiclePhoto(vehicleId, uploadPhotos[0]));
    }

    async updateById(req: Request, res: Response) {
        // parse data and files from req
        let uploadPhoto = null;
        if (req.files && Object.keys(req.files).length) {
            uploadPhoto = await this.getUploadPhotos(req, res);
        }
        const itemString = req.body?.data as string;
        const item = JSON.parse(itemString);
        const vehicleId = Number(req.params.id);
        if (vehicleId <= 0) {
            res.status(400).send(["The vehicle ID must be a numerical value larger than 0."]);
            return;
        }

        // find vehicle in db and check if it is own by current user
        const vehicle: VehicleModel | IErrorResponse = await this.services.vehicleService.getById(vehicleId);

        if (vehicle === null) {
            res.sendStatus(404);
            return;
        }
        if (req.authorized?.role === "user" && vehicle instanceof VehicleModel && vehicle.userId !== Number(req.authorized?.id)) {
            res.status(401).send("This vehicle does not belong to you.");
            return;
        }

        // validation and db update
        if (!IUpdateVehicleSchemaValidator(item)) {
            res.status(400).send(IUpdateVehicleSchemaValidator.errors);
            return;
        }
        const result: VehicleModel | IErrorResponse = await this.services.vehicleService.update(vehicleId, item as IUpdateVehicle, uploadPhoto);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }

    async deleteById(req: Request, res: Response) {
        // parse data from req
        const id: number = +(req.params?.id);
        if (id <= 0) {
            res.sendStatus(404);
            return;
        }

        // find vehicle in db and check if it is own by current user
        const item: VehicleModel | null = await this.services.vehicleService.getById(id);
        if (item == null) {
            res.sendStatus(404);
            return;
        }
        if (req.authorized?.role === "user" && item instanceof VehicleModel && item.userId !== Number(req.authorized?.id)) {
            res.status(401).send("This vehicle does not belong to you.");
            return;
        }

        // delete vehicle record
        res.send(await this.services.vehicleService.delete(id));
    }

    async deletePhotoByVehicleId(req: Request, res: Response) {
        // parse data from req
        const vehicleId: number = +(req.params?.id);
        if (vehicleId <= 0) {
            res.sendStatus(404);
            return;
        }
        // find vehicle in db and check if it is own by current user
        const vehicle: VehicleModel | null = await this.services.vehicleService.getById(vehicleId);
        if (vehicle == null) {
            res.sendStatus(404);
            return;
        }
        if (req.authorized?.role === "user" && vehicle instanceof VehicleModel && vehicle.userId !== Number(req.authorized?.id)) {
            res.status(401).send("This vehicle does not belong to you.");
            return;
        }

        // find photo of the vehicle in db and delete it
        const result = await this.services.vehicleService.deletePhotoByVehicleId(vehicleId);
        if (result === null) {
            res.sendStatus(404);
            return;
        }
        res.send(result);
    }
}
