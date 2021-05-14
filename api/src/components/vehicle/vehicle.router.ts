import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import VehicleController from './vehicle.controller';
import VehicleService from './vehicle.service';

export default class VehicleRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        // Service
        const vehicleService: VehicleService = new VehicleService(resources.databaseConnection);

        // Controller
        const vehicleController: VehicleController = new VehicleController(vehicleService);

        // Routing

        app.get("/api/vehicle", vehicleController.getAll.bind(vehicleController));
        app.get("/api/vehicle/:id", vehicleController.getById.bind(vehicleController));
        app.post("/api/vehicle", vehicleController.create.bind(vehicleController));
        app.put("/api/vehicle/:id", vehicleController.updateById.bind(vehicleController));
        app.delete("/api/vehicle/:id", vehicleController.deleteById.bind(vehicleController));
    }
}