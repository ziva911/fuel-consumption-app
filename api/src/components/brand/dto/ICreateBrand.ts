import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateBrand {
    name: string;
    logo: string;
}

const ICreateBrandSchema = {
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

const ICreateBrandSchemaValidator = ajv.compile(ICreateBrandSchema);

export { ICreateBrandSchema };
export { ICreateBrandSchemaValidator };
export { ICreateBrand };
