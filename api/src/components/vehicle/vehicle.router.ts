import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import VehicleController from './vehicle.controller';

export default class VehicleRouter implements IRouter {

    setupRoutes(app: Application, resources: IApplicationResources) {

        // Controller
        const vehicleController: VehicleController = new VehicleController(resources);

        // Routing

        app.get("/api/vehicle", vehicleController.getAll.bind(vehicleController));
        app.get("/api/vehicle/:id", vehicleController.getById.bind(vehicleController));
        app.post("/api/vehicle", vehicleController.create.bind(vehicleController));
        app.put("/api/vehicle/:id", vehicleController.updateById.bind(vehicleController));
        app.post("/api/vehicle/:id/photo", vehicleController.addVehiclePhoto.bind(vehicleController));
        //app.delete("/api/vehicle/:id", vehicleController.deleteById.bind(vehicleController));
    }
}