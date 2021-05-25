import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateVehicle {
    internalName: string | null,
    paintColor: string,
    userId: number
}

const IUpdateVehicleSchema = {
    type: "object",
    properties: {
        internalName: {
            type: ["string", "null"],
            minLength: 1,
            maxLength: 100,
        },
        paintColor: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        userId: {
            type: ["integer"],
            minimum: 1,
        }

    },
    required: [
        "userId",
    ],
    additionalProperties: true,
}

const IUpdateVehicleSchemaValidator = ajv.compile(IUpdateVehicleSchema);

export { IUpdateVehicleSchema };
export { IUpdateVehicleSchemaValidator };
export { IUpdateVehicle };
