import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateBrand {
    id: number;
    name: string;
    logo: string;
}

const IUpdateBrandSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64
        },
        logo: {
            type: "string",
            minLength: 2,
            maxLength: 255,
            pattern: "\.(png|jpg)$"
        }
    },
    required: [
        "name",
        "logo"
    ],
    additionalProperties: false,
}

const IUpdateBrandSchemaValidator = ajv.compile(IUpdateBrandSchema);

export { IUpdateBrandSchema };
export { IUpdateBrandSchemaValidator };
export { IUpdateBrand };