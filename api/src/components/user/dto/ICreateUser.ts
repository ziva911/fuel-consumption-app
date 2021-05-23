import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateUser {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    currency: 'RSD' | 'EUR' | 'USD';
    language: 'SR' | 'EN';
}

const ICreateUserSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 64
        },
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
        "username",
        "password"
    ],
    additionalProperties: false,
}

const ICreateUserSchemaValidator = ajv.compile(ICreateUserSchema);

export { ICreateUserSchema };
export { ICreateUserSchemaValidator };
export { ICreateUser };