import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateVehicle {
    name: string;
    imagePath: string;
    parentCategoryId?: number;
}

const IUpdateVehicleSchema = {
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

const IUpdateVehicleSchemaValidator = ajv.compile(IUpdateVehicleSchema);

export { IUpdateVehicleSchema };
export { IUpdateVehicleSchemaValidator };
export { IUpdateVehicle };