import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/middleware';
import VehicleController from './vehicle.controller';

export default class VehicleRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        const vehicleController: VehicleController = new VehicleController(resources);

        // Vehicle routes
        app.get(
            "/api/administrator/vehicle",
            AuthMiddleware.getVerifier("administrator"),
            vehicleController.getAll.bind(vehicleController)
        );
        app.get(
            "/api/vehicle",
            AuthMiddleware.getVerifier("user"),
            vehicleController.getAllByUserId.bind(vehicleController)
        );
        app.get(
            "/api/user/:uid/vehicle",
            AuthMiddleware.getVerifier("administrator"),
            vehicleController.getAllByUserId.bind(vehicleController)
        );
        app.get(
            "/api/vehicle/:id",
            AuthMiddleware.getVerifier("user", "administrator"),
            vehicleController.getById.bind(vehicleController)
        );
        app.post(
            "/api/vehicle",
            AuthMiddleware.getVerifier("user"),
            vehicleController.create.bind(vehicleController)
        );
        app.post(
            "/api/user/:uid/vehicle",
            AuthMiddleware.getVerifier("administrator"),
            vehicleController.create.bind(vehicleController)
        );
        app.post(
            "/api/vehicle/:id/photo",
            AuthMiddleware.getVerifier("user", "administrator"),
            vehicleController.addVehiclePhoto.bind(vehicleController)
        );
        app.put(
            "/api/vehicle/:id",
            AuthMiddleware.getVerifier("user", "administrator"),
            vehicleController.updateById.bind(vehicleController)
        );
        app.delete(
            "/api/vehicle/:id",
            AuthMiddleware.getVerifier("user", "administrator"),
            vehicleController.deleteById.bind(vehicleController)
        );
        app.delete(
            "/api/vehicle/:id/photo",
            AuthMiddleware.getVerifier("user", "administrator"),
            vehicleController.deletePhotoByVehicleId.bind(vehicleController)
        );
    }
}
