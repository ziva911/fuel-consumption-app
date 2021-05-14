import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import FuelTypeController from './fuel-type.controller';
import FuelTypeService from './fuel-type.service';

export default class FuelTypeRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        // Service
        const fuelTypeService: FuelTypeService = new FuelTypeService(resources.databaseConnection);

        // Controller
        const fuelTypeController: FuelTypeController = new FuelTypeController(fuelTypeService);

        // Routing

        app.get("/api/fuel-type", fuelTypeController.getAll.bind(fuelTypeController));
        // app.get("/api/brand/:id", fuelTypeController.getById.bind(fuelTypeController));
        app.post("/api/fuel-type", fuelTypeController.create.bind(fuelTypeController));
        app.put("/api/fuel-type/:id", fuelTypeController.updateById.bind(fuelTypeController));
        app.delete("/api/fuel-type/:id", fuelTypeController.deleteById.bind(fuelTypeController));
    }
}