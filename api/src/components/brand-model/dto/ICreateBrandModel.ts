import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateBrandModel {
    brandId: number;
    name: string;
}

const ICreateBrandModelSchema = {
    type: "object",
    properties: {
        brandId: {
            type: "number",
            minimum: 1
        },
        name: {
            type: "string",
            minLength: 2,
            maxLength: 24
        }
    },
    required: [
        "brandId",
        "name"
    ],
    additionalProperties: false,
}

const ICreateBrandModelSchemaValidator = ajv.compile(ICreateBrandModelSchema);

export { ICreateBrandModelSchema };
export { ICreateBrandModelSchemaValidator };
export { ICreateBrandModel };