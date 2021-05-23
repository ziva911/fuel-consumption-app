import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdatePhoto {
    id: number;
    imagePath: string;
    brandModelId: number;
    manufactureYear: number;
    paintColor: string;
}

const IUpdatePhotoSchema = {
    type: "object",
    properties: {
        id: {
            type: "number",
            minimum: 1
        },
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

const IUpdatePhotoSchemaValidator = ajv.compile(IUpdatePhotoSchema);

export { IUpdatePhotoSchema };
export { IUpdatePhotoSchemaValidator };
export { IUpdatePhoto };