import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import FuelTypeController from './fuel-type.controller';

export default class FuelTypeRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        // Controller
        const fuelTypeController: FuelTypeController = new FuelTypeController(resources);

        // Routing
        app.get("/api/fuel-type", fuelTypeController.getAll.bind(fuelTypeController));
        // app.get("/api/fuel-type/:id", fuelTypeController.getById.bind(fuelTypeController));
        app.post("/api/fuel-type", fuelTypeController.create.bind(fuelTypeController));
        app.put("/api/fuel-type/:id", fuelTypeController.updateById.bind(fuelTypeController));
        app.delete("/api/fuel-type/:id", fuelTypeController.deleteById.bind(fuelTypeController));
    }
}