import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateAdministrator {
    password: string;
}

const IUpdateAdministratorSchema = {
    type: "object",
    properties: {
        password: {
            type: "string",
            minLength: 2,
            maxLength: 128
        }
    },
    required: [
        "password"
    ],
    additionalProperties: false,
}

const IUpdateAdministratorSchemaValidator = ajv.compile(IUpdateAdministratorSchema);

export { IUpdateAdministratorSchema };
export { IUpdateAdministratorSchemaValidator };
export { IUpdateAdministrator };