import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/middleware';
import RefuelHistoryController from './refuel-history.controller';

export default class RefuelHistoryRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        const refuelHistoryController: RefuelHistoryController = new RefuelHistoryController(resources);

        //Refuel history routes
        app.get(
            "/api/vehicle/:vid/history",
            AuthMiddleware.getVerifier("user", "administrator"),
            refuelHistoryController.getAllByVehicleId.bind(refuelHistoryController)
        );
        app.get(
            "/api/vehicle/history",
            AuthMiddleware.getVerifier("administrator"),
            refuelHistoryController.getAll.bind(refuelHistoryController)
        );
        app.post(
            "/api/vehicle/:vid/history",
            AuthMiddleware.getVerifier("user", "administrator"),
            refuelHistoryController.create.bind(refuelHistoryController)
        );
        app.put(
            "/api/vehicle/:vid/history/:id",
            AuthMiddleware.getVerifier("user", "administrator"),
            refuelHistoryController.updateById.bind(refuelHistoryController)
        );
        app.delete(
            "/api/vehicle/:vid/history/:id",
            AuthMiddleware.getVerifier("user", "administrator"),
            refuelHistoryController.deleteById.bind(refuelHistoryController)
        );
        app.delete(
            "/api/vehicle/:vid/history",
            AuthMiddleware.getVerifier("user", "administrator"),
            refuelHistoryController.deleteAllVehicleHistory.bind(refuelHistoryController)
        );
    }
}
