import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/middleware';
import UserController from './user.controller';

export default class UserRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        const userController: UserController = new UserController(resources);

        // User routes
        app.get(
            "/api/user/all",
            AuthMiddleware.getVerifier("administrator"),
            userController.getAll.bind(userController)
        );
        app.get(
            "/api/user",
            AuthMiddleware.getVerifier("user"),
            userController.getById.bind(userController)
        );
        app.get(
            "/api/user/:uid",
            AuthMiddleware.getVerifier("administrator"),
            userController.getById.bind(userController)
        );
        app.post(
            "/api/user",
            AuthMiddleware.getVerifier("administrator"),
            userController.create.bind(userController)
        );
        app.post(
            "/api/user/register",
            userController.register.bind(userController)
        );
        app.put(
            "/api/user/:uid",
            AuthMiddleware.getVerifier("administrator"),
            userController.updateById.bind(userController)
        );
        app.put(
            "/api/user",
            AuthMiddleware.getVerifier("user"),
            userController.updateById.bind(userController)
        );
        app.get(
            "/api/user/register/verification/:code",
            userController.registerVerification.bind(userController)
        );
        app.delete("/api/user/:id", userController.deleteById.bind(userController));
    }
}
