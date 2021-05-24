import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import UserController from './user.controller';

export default class UserRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        // Controller
        const userController: UserController = new UserController(resources);

        // Routing
        app.get("/api/user", userController.getAll.bind(userController));
        app.get("/api/user/:id", userController.getById.bind(userController));
        app.post("/api/user", userController.create.bind(userController));
        app.post("/api/user/register", userController.register.bind(userController));
        app.put("/api/user/:id", userController.updateById.bind(userController));
        app.get("/api/user/register/verification/:id", userController.registerVerification.bind(userController));
        app.delete("/api/user/:id", userController.deleteById.bind(userController));
    }
}