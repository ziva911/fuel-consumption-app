import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/middleware';
import AdministratorController from './administrator.controller';

export default class AdministratorRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        const administratorController: AdministratorController = new AdministratorController(resources);

        // Administrator routes
        app.get(
            "/api/administrator",
            AuthMiddleware.getVerifier("administrator"),
            administratorController.getAll.bind(administratorController)
        );
        app.get(
            "/api/administrator/:id",
            AuthMiddleware.getVerifier("administrator"),
            administratorController.getById.bind(administratorController)
        );
        app.post(
            "/api/administrator",
            AuthMiddleware.getVerifier("administrator"),
            administratorController.create.bind(administratorController)
        );
        app.put(
            "/api/administrator/:id",
            AuthMiddleware.getVerifier("administrator"),
            administratorController.updateById.bind(administratorController)
        );
        app.delete(
            "/api/administrator/:id",
            AuthMiddleware.getVerifier("administrator"),
            administratorController.deleteById.bind(administratorController)
        );
    }
}
