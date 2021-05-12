import * as express from "express";
import IApplicationResources from '../../services/IApplicationResources.interface';
import VehicleService from './service';
import VehicleController from './controller';

export default class VehicleRouter {
    public static setupeRoutes(app: express.Application, resources: IApplicationResources) {

        // Service
        const vehicleService: VehicleService = new VehicleService;

        // Controller
        const vehicleController: VehicleController = new VehicleController(vehicleService);

        // Routing

        app.get("/api/vehicle", vehicleController.getAll.bind(vehicleController));
        app.get("/api/vehicle/:id", vehicleController.getById.bind(vehicleController));
    }
}