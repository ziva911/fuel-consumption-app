import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/middleware';
import BrandController from './brand.controller';

export default class BrandRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        const brandController: BrandController = new BrandController(resources);

        // Brand routes
        app.get(
            "/api/brand",
            AuthMiddleware.getVerifier("user", "administrator"),
            brandController.getAll.bind(brandController)
        );
        app.get(
            "/api/brand/:id",
            AuthMiddleware.getVerifier("administrator"),
            brandController.getById.bind(brandController)
        );
        app.post(
            "/api/brand",
            AuthMiddleware.getVerifier("administrator"),
            brandController.create.bind(brandController)
        );
        app.put(
            "/api/brand/:id",
            AuthMiddleware.getVerifier("administrator"),
            brandController.updateById.bind(brandController)
        );
        app.delete(
            "/api/brand/:id",
            AuthMiddleware.getVerifier("administrator"),
            brandController.deleteById.bind(brandController)
        );
    }
}
