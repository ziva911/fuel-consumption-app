import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateVehicle {
    name: string;
    imagePath: string;
    parentCategoryId?: number;
}

const ICreateVehicleSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        imagePath: {
            type: "string",
            minLength: 2,
            maxLength: 255,
            pattern: "\.(png|jpg)$"
        },
        parentCategoryId: {
            type: ["integer", "null"],
            minimum: 1,
        },

    },
    required: [
        "name",
        "imagePath",
    ],
    additionalProperties: false,
}

const ICreateVehicleSchemaValidator = ajv.compile(ICreateVehicleSchema);

export { ICreateVehicleSchema };
export { ICreateVehicleSchemaValidator };
export { ICreateVehicle };