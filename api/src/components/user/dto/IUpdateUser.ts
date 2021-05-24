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
        "password",
        "firstName",
        "lastName",
        "phoneNumber",
        "currency",
        "language"
    ],
    additionalProperties: false,
}

const IUpdateUserSchemaValidator = ajv.compile(IUpdateUserSchema);

export { IUpdateUserSchema };
export { IUpdateUserSchemaValidator };
export { IUpdateUser };