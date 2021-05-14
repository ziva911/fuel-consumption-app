import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateFuelType {
    name: string;
}

const ICreateFuelTypeSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64
        }
    },
    required: [
        "name"
    ],
    additionalProperties: false,
}

const ICreateFuelTypeSchemaValidator = ajv.compile(ICreateFuelTypeSchema);

export { ICreateFuelTypeSchema };
export { ICreateFuelTypeSchemaValidator };
export { ICreateFuelType };