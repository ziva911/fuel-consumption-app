import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import Config from "./config/dev";
import * as fs from "fs";
import * as path from "path";

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

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(Config.server.port);

