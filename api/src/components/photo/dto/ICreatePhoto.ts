import Ajv from "ajv";

const ajv = new Ajv();

interface ICreatePhoto {
    imagePath: string;
    brandModelId: number;
    manufactureYear: number;
    paintColor: string;
}

interface IUploadPhoto {
    imagePath: string;
}

const ICreatePhotoSchema = {
    type: "object",
    properties: {
        imagePath: {
            type: "string",
            maxLength: 255
        },
        brandModelId: {
            type: "number",
            minimum: 1
        },
        manufactureYear: {
            type: "number",
            minimum: 1800,
            maximum: (new Date()).getFullYear()
        },
        paintColor: {
            type: "string",
            minLength: 2,
            maxLength: 24
        }
    },
    required: [
        "imagePath"
    ],
    additionalProperties: true,
}

const ICreatePhotoSchemaValidator = ajv.compile(ICreatePhotoSchema);

export { ICreatePhotoSchema };
export { ICreatePhotoSchemaValidator };
export { ICreatePhoto };
export { IUploadPhoto };