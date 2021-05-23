import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import BrandModelController from './brand-model.controller';

export default class BrandModelRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        // Controller
        const brandModelController: BrandModelController = new BrandModelController(resources);

        // Routing

        app.get("/api/brand/:brandid/model", brandModelController.getAllByBrandId.bind(brandModelController));
        app.get("/api/model/:id", brandModelController.getById.bind(brandModelController));
        app.post("/api/model", brandModelController.create.bind(brandModelController));
        app.put("/api/model/:id", brandModelController.updateById.bind(brandModelController));
        app.delete("/api/model/:id", brandModelController.deleteById.bind(brandModelController));
    }
}