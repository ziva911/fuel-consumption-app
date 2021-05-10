import IConfig from "./IConfig.interface";

const Config: IConfig = {
    server: {
        port: 4000,
        static: {
            path: "static/",
            route: "/static",
            cacheControl: true,
            dotfiles: "deny",
            etag: true,
            maxAge: 3600000,
            index: false
        }
    },
    logger: {
        path: "logs/access.log"
    }
}

export default Config;