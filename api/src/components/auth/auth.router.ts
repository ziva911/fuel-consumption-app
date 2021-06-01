import IRouter from '../../common/IRouter.interface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AuthController from './auth.controller';
import AuthMiddleware from '../../middleware/middleware';

export default class AuthRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {

        const authController: AuthController = new AuthController(resources);

        // Login routes
        application.post("/api/auth/user/login", authController.userLogin.bind(authController));
        application.post("/api/auth/administrator/login", authController.administratorLogin.bind(authController))
        application.post("/api/auth/user/refresh", authController.userRefresh.bind(authController));
        application.post("/api/auth/administrator/refresh", authController.administratorRefresh.bind(authController))
        application.get(
            "/api/auth/user/ok",
            AuthMiddleware.getVerifier("user"),
            authController.sendOk.bind(authController)
        );
        application.get(
            "/api/auth/administrator/ok",
            AuthMiddleware.getVerifier("administrator"),
            authController.sendOk.bind(authController)
        );
    }
};
