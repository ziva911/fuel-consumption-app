import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AdministratorController from './administrator.controller';

export default class AdministratorRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        // Controller
        const administratorController: AdministratorController = new AdministratorController(resources);

        // Routing
        app.get("/api/administrator", administratorController.getAll.bind(administratorController));
        app.get("/api/administrator/:id", administratorController.getById.bind(administratorController));
        app.post("/api/administrator", administratorController.create.bind(administratorController));
        app.put("/api/administrator/:id", administratorController.updateById.bind(administratorController));
        app.delete("/api/administrator/:id", administratorController.deleteById.bind(administratorController));
    }
}
