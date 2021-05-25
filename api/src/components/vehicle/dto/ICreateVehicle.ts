import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateVehicle {
    internalName: string | null,
    manufactureYear: number,
    paintColor: string,
    mileageStart: number,
    fuelTypeId: number,
    mileageCurrent: number,
    brandModelId: number,
    userId: number
}

const ICreateVehicleSchema = {
    type: "object",
    properties: {
        internalName: {
            type: "string",
            minLength: 1,
            maxLength: 100,
        },
        manufactureYear: {
            type: ["integer", "null"],
            minimum: 1,
        },
        paintColor: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        mileageStart: {
            type: ["integer"],
            minimum: 0,
        },
        fuelTypeId: {
            type: ["integer"],
            minimum: 1,
        },
        mileageCurrent: {
            type: ["integer"],
            minimum: 0,
        },
        brandModelId: {
            type: ["integer"],
            minimum: 1,
        },
        userId: {
            type: ["integer", "null"],
            minimum: 1,
        }

    },
    required: [
        "manufactureYear",
        "paintColor",
        "mileageStart",
        "fuelTypeId",
        "mileageCurrent",
        "brandModelId",
        "userId",
    ],
    additionalProperties: true,
}

const ICreateVehicleSchemaValidator = ajv.compile(ICreateVehicleSchema);

export { ICreateVehicleSchema };
export { ICreateVehicleSchemaValidator };
export { ICreateVehicle };
