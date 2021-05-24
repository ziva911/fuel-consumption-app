import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateAdministrator {
    username: string;
    password: string;
}

const ICreateAdministratorSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 5,
            maxLength: 32
        },
        password: {
            type: "string",
            minLength: 5,
            maxLength: 128
        }
    },
    required: [
        "username",
        "password"
    ],
    additionalProperties: false,
}

const ICreateAdministratorSchemaValidator = ajv.compile(ICreateAdministratorSchema);

export { ICreateAdministratorSchema };
export { ICreateAdministratorSchemaValidator };
export { ICreateAdministrator };