import IConfig from "../common/IConfig.interface";

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
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "nikola",
        password: "nikola92",
        database: "fuel-consumption-db",
        charset: "utf8mb4",
        timezone: "+01:00"
    }
}

export default Config;