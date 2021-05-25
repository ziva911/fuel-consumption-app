import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateRefuelHistory {
    date: Date;
    quantity: number;
    totalCost: number;
    isFull: boolean;
    mileageCurrent: number;
    vehicleId: number;
}
const ICreateRefuelHistorySchema = {
    type: "object",
    properties: {
        date: {
            type: "string",
            minLength: 10
        },
        quantity: {
            type: "number",
            minimum: 0
        },
        totalCost: {
            type: "number",
            minimum: 0
        },
        isFull: {
            type: "boolean"
        },
        mileageCurrent: {
            type: "number",
            minimum: 0
        },
        vehicleId: {
            type: ["integer"]
        }
    },
    required: [
        "date",
        "quantity",
        "totalCost",
        "isFull",
        "mileageCurrent",
        "vehicleId"
    ],
    additionalProperties: false,
}

const ICreateRefuelHistorySchemaValidator = ajv.compile(ICreateRefuelHistorySchema);

export { ICreateRefuelHistorySchema };
export { ICreateRefuelHistorySchemaValidator };
export { ICreateRefuelHistory };
