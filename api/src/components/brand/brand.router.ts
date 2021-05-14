import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import BrandController from './brand.controller';
import BrandService from './brand.service';

export default class BrandRouter implements IRouter {

    setupRoutes(app: express.Application, resources: IApplicationResources) {

        // Service
        const brandService: BrandService = new BrandService(resources.databaseConnection);

        // Controller
        const brandController: BrandController = new BrandController(brandService);

        // Routing

        app.get("/api/brand", brandController.getAll.bind(brandController));
        app.get("/api/brand/:id", brandController.getById.bind(brandController));
        app.post("/api/brand", brandController.create.bind(brandController));
        app.put("/api/brand/:id", brandController.updateById.bind(brandController));
        app.delete("/api/brand/:id", brandController.deleteById.bind(brandController));
    }
}