import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";

import Config from "./config/dev";
import VehicleRouter from './components/vehicle/vehicle.router';
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from 'mysql2/promise';
import Router from './router';
import BrandRouter from './components/brand/brand.router';
import BrandModelRouter from "./components/brand-model/brand-model.router";
import FuelTypeRouter from "./components/fuel-type/fuel-type.router";

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

    const resources: IApplicationResources = {
        databaseConnection: await mysql2.createConnection({
            host: Config.database.host,
            port: Config.database.port,
            user: Config.database.user,
            password: Config.database.password,
            database: Config.database.database,
            charset: Config.database.charset,
            timezone: Config.database.timezone,
            supportBigNumbers: true,
        }),
    };

    resources.databaseConnection.connect();

    Router.setupRoutes(
        app,
        resources,
        [
            new VehicleRouter(),
            new BrandRouter(),
            new BrandModelRouter(),
            new FuelTypeRouter(),
        ]
    );
    app.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });

    app.listen(Config.server.port);

}

main();