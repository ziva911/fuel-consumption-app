import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";
import * as mysql2 from 'mysql2/promise';

import Config from "./config/dev";
import IApplicationResources from "./common/IApplicationResources.interface";
import Router from './router';
import VehicleRouter from './components/vehicle/vehicle.router';
import BrandRouter from './components/brand/brand.router';
import BrandModelRouter from "./components/brand-model/brand-model.router";
import FuelTypeRouter from "./components/fuel-type/fuel-type.router";
import BrandService from "./components/brand/brand.service";
import BrandModelService from "./components/brand-model/brand-model.service";
import FuelTypeService from "./components/fuel-type/fuel-type.service";
import AdministratorService from './components/administrator/administrator.service';
import fileUpload = require("express-fileupload");
import AdministratorRouter from "./components/administrator/administrator.router";
import UserRouter from "./components/user/user.router";
import UserService from "./components/user/user.service";
import PhotoService from "./components/photo/photo.service";
import VehicleService from './components/vehicle/vehicle.service';

async function main() {

    const app: express.Application = express();

    fs.mkdirSync(path.dirname(Config.logger.path), {
        mode: 0o755,
        recursive: true
    });

    app.use(morgan(":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms", {
        stream: fs.createWriteStream(Config.logger.path)
    }));

    app.use(
        Config.server.static.route,
        express.static(
            Config.server.static.path,
            {
                cacheControl: Config.server.static.cacheControl,
                dotfiles: Config.server.static.dotfiles,
                etag: Config.server.static.etag,
                maxAge: Config.server.static.maxAge,
                index: Config.server.static.index
            }
        )
    );

    app.use(cors());
    app.use(express.json());
    app.use(fileUpload({
        limits: {
            fileSize: Config.fileUploadOptions.maxSize,
            files: Config.fileUploadOptions.maxFiles
        },
        tempFileDir: Config.fileUploadOptions.tempDirectory,
        uploadTimeout: Config.fileUploadOptions.timeout,
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
        abortOnLimit: true,
        createParentPath: true
    }));

    const databaseConnection = await mysql2.createConnection({
        host: Config.database.host,
        port: Config.database.port,
        user: Config.database.user,
        password: Config.database.password,
        database: Config.database.database,
        charset: Config.database.charset,
        timezone: Config.database.timezone,
        supportBigNumbers: true,
    });

    databaseConnection.connect();
    const resources: IApplicationResources = {
        databaseConnection: databaseConnection,
    }

    resources.services = {
        brandService: new BrandService(resources),
        brandModelService: new BrandModelService(resources),
        fuelTypeService: new FuelTypeService(resources),
        vehicleService: new VehicleService(resources),
        photoService: new PhotoService(resources),
        administratorService: new AdministratorService(resources),
        userService: new UserService(resources),
    }

    Router.setupRoutes(
        app,
        resources,
        [
            new BrandRouter(),
            new BrandModelRouter(),
            new FuelTypeRouter(),
            new AdministratorRouter(),
            new UserRouter(),
            new VehicleRouter(),
        ]
    );
    app.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });

    app.listen(Config.server.port);

}

main();
