import Ajv from "ajv";

const ajv = new Ajv();

interface IRefreshToken {
    refreshToken: string;
}

const IRefreshTokenSchemaValidator = ajv.compile({
    type: "object",
    properties: {
        refreshToken: {
            type: "string"
        }
    },
    required: [
        "refreshToken"
    ],
    additionalProperties: false,
});
export { IRefreshTokenSchemaValidator };
export { IRefreshToken };
