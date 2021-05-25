import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateRefuelHistory {
    quantity: number;
    totalCost: number;
    isFull: boolean;
}
const IUpdateRefuelHistorySchema = {
    type: "object",
    properties: {
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
        }
    },
    required: [
        "quantity",
        "totalCost",
        "isFull"
    ],
    additionalProperties: false,
}

const IUpdateRefuelHistorySchemaValidator = ajv.compile(IUpdateRefuelHistorySchema);

export { IUpdateRefuelHistorySchema };
export { IUpdateRefuelHistorySchemaValidator };
export { IUpdateRefuelHistory };
