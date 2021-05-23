import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateUser {
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    currency: 'RSD' | 'EUR' | 'USD';
    language: 'SR' | 'EN';
}

const IUpdateUserSchema = {
    type: "object",
    properties: {
        password: {
            type: "string",
            minLength: 2,
            maxLength: 128
        },
        firstName: {
            type: "string",
            minLength: 2,
            maxLength: 128
        },
        lastName: {
            type: "string",
            minLength: 2,
            maxLength: 128
        },
        phoneNumber: {
            type: "string",
            minLength: 7,
            maxLength: 15,
        },
        currency: {
            type: "string",
            maxLength: 5
        },
        language: {
            type: "string",
            maxLength: 5
        },

    },
    required: [
        "password"
    ],
    additionalProperties: false,
}

const IUpdateUserSchemaValidator = ajv.compile(IUpdateUserSchema);

export { IUpdateUserSchema };
export { IUpdateUserSchemaValidator };
export { IUpdateUser };