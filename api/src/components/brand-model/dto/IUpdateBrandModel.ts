import Ajv from "ajv";
import BrandModel from "../brand-model.model";

const ajv = new Ajv();

interface IUpdateBrandModel {
    id: number;
    brandId: number;
    brand: BrandModel | null;
    name: string;
}

const IUpdateBrandModelSchema = {
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

const IUpdateBrandModelSchemaValidator = ajv.compile(IUpdateBrandModelSchema);

export { IUpdateBrandModelSchema };
export { IUpdateBrandModelSchemaValidator };
export default IUpdateBrandModel;
