import { Request, Response, NextFunction } from 'express';
import VehicleModel from './vehicle.model';
import { ICreateVehicle, ICreateVehicleSchemaValidator } from './dto/ICreateVehicle';
import { IUpdateVehicle, IUpdateVehicleSchemaValidator } from './dto/IUpdateVehicle';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';

export default class VehicleController extends BaseController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        let userId = 1; //TODO
        res.send(await this.services.vehicleService.getAllByUserId(userId, { loadChildren: true }));
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: VehicleModel | null = await this.services.vehicleService.getById(id, { loadChildren: true });

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        let uploadPhoto = null;
        if (req.files && Object.keys(req.files).length) {
            uploadPhoto = await this.getUploadPhotos(req, res);
        }
        const itemString = req.body?.data as string;
        const item = JSON.parse(itemString);

        if (!ICreateVehicleSchemaValidator(item)) {
            res.status(400).send(ICreateVehicleSchemaValidator.errors);
            return;
        }
        const newVehicle: VehicleModel | IErrorResponse = await this.services.vehicleService.create(item as ICreateVehicle, uploadPhoto);
        res.send(newVehicle);
    }

    async updateById(req: Request, res: Response, next: NextFunction) {
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
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(404);
            return;
        }
        const item: VehicleModel | null = await this.services.vehicleService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }
        res.send(await this.services.vehicleService.delete(id));
    }

    async deletePhotoByVehicleId(req: Request, res: Response, next: NextFunction) {
        const vehicleId: number = +(req.params?.id);

        if (vehicleId <= 0) {
            res.sendStatus(404);
            return;
        }

        const result = await this.services.vehicleService.deletePhotoByVehicleId(vehicleId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }
        res.send(result);
    }

    public async addVehiclePhoto(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(404);
            return;
        }
        const vehicle = await this.services.vehicleService.getById(id, { loadChildren: true })
        if (vehicle == null) {
            res.sendStatus(404);
            return;
        }
        const uploadPhotos = await this.getUploadPhotos(req, res);
        if (uploadPhotos.length === 0) {
            return;
        }
        res.send(await this.services.vehicleService.addVehiclePhoto(id, uploadPhotos[0]));
    }


}