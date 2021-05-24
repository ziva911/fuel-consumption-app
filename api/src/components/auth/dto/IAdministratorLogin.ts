import Ajv from "ajv";

const ajv = new Ajv();


interface IAdministratorLogin {
    email: string;
    password: string;
}

const IAdministratorLoginSchemaValidator = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            minLength: 5,
            maxLength: 255,
        },
        password: {
            type: "string",
            minLength: 5,
            maxLength: 128,
        },
    },
    required: [
        "email",
        "password",

    ],
    additionalProperties: false,
});
export { IAdministratorLoginSchemaValidator };
export { IAdministratorLogin };
