import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdateUser {
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    language?: 'SR' | 'EN';
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
    ],
    additionalProperties: false,
}

const IUpdateUserSchemaValidator = ajv.compile(IUpdateUserSchema);

export { IUpdateUserSchema };
export { IUpdateUserSchemaValidator };
export default IUpdateUser;
