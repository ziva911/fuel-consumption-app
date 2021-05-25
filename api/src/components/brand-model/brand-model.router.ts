import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import BrandModelController from './brand-model.controller';
import AuthMiddleware from '../../middleware/middleware';

export default class BrandModelRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        const brandModelController: BrandModelController = new BrandModelController(resources);

        // Brand model routes

        app.get(
            "/api/brand/:bid/model",
            AuthMiddleware.getVerifier("user", "administrator"),
            brandModelController.getAllByBrandId.bind(brandModelController)
        );
        app.get(
            "/api/brand/model/:id",
            AuthMiddleware.getVerifier("user", "administrator"),
            brandModelController.getById.bind(brandModelController)
        );
        app.post(
            "/api/model",
            AuthMiddleware.getVerifier("administrator"),
            brandModelController.create.bind(brandModelController)
        );
        app.put(
            "/api/model/:id",
            AuthMiddleware.getVerifier("administrator"),
            brandModelController.updateById.bind(brandModelController)
        );
        app.delete(
            "/api/model/:id",
            AuthMiddleware.getVerifier("administrator"),
            brandModelController.deleteById.bind(brandModelController)
        );
    }
}
