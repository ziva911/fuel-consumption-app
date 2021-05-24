import Ajv from "ajv";

const ajv = new Ajv();

interface ICreateUser {
    email: string;
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
        email: {
            type: "string",
            minLength: 5,
            maxLength: 255
        },
        password: {
            type: "string",
            minLength: 5,
            maxLength: 128
        },
        firstName: {
            type: "string",
            minLength: 2,
            maxLength: 32
        },
        lastName: {
            type: "string",
            minLength: 2,
            maxLength: 32
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
        "email",
        "password",
        "firstName",
        "lastName",
        "phoneNumber",
        "currency",
        "language"
    ],
    additionalProperties: false,
}

const ICreateUserSchemaValidator = ajv.compile(ICreateUserSchema);

export { ICreateUserSchema };
export { ICreateUserSchemaValidator };
export { ICreateUser };
