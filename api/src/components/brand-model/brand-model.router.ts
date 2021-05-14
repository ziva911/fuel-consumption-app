import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import BrandModelController from './brand-model.controller';
import BrandModelService from './brand-model.service';

export default class BrandModelRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        // Service
        const brandModelService: BrandModelService = new BrandModelService(resources.databaseConnection);

        // Controller
        const brandModelController: BrandModelController = new BrandModelController(brandModelService);

        // Routing

        app.get("/api/brand/:brandid/model", brandModelController.getAllByBrandId.bind(brandModelController));
        app.get("/api/model/:id", brandModelController.getById.bind(brandModelController));
        app.post("/api/model", brandModelController.create.bind(brandModelController));
        app.put("/api/model/:id", brandModelController.updateById.bind(brandModelController));
        app.delete("/api/model/:id", brandModelController.deleteById.bind(brandModelController));
    }
}