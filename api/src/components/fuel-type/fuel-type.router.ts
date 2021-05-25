import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/middleware';
import FuelTypeController from './fuel-type.controller';

export default class FuelTypeRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        // Controller
        const fuelTypeController: FuelTypeController = new FuelTypeController(resources);

        // Routing
        app.get(
            "/api/fuel-type",
            AuthMiddleware.getVerifier("user", "administrator"),
            fuelTypeController.getAll.bind(fuelTypeController)
        );
        app.post(
            "/api/fuel-type",
            AuthMiddleware.getVerifier("administrator"),
            fuelTypeController.create.bind(fuelTypeController)
        );
        app.put(
            "/api/fuel-type/:id",
            AuthMiddleware.getVerifier("administrator"),
            fuelTypeController.updateById.bind(fuelTypeController)
        );
        app.delete(
            "/api/fuel-type/:id",
            AuthMiddleware.getVerifier("administrator"),
            fuelTypeController.deleteById.bind(fuelTypeController)
        );
    }
}