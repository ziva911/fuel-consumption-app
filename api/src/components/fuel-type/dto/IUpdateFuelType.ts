import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateFuelType {
    id: number;
    name: string;
}

const IUpdateFuelTypeSchema = {
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

const IUpdateFuelTypeSchemaValidator = ajv.compile(IUpdateFuelTypeSchema);

export { IUpdateFuelTypeSchema };
export { IUpdateFuelTypeSchemaValidator };
export { IUpdateFuelType };
