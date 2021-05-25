import Ajv from "ajv";

const ajv = new Ajv();

interface IUpdatePhoto {
    imagePath: string;
    brandModelId: number;
    manufactureYear: number;
    paintColor: string;
}

const IUpdatePhotoSchema = {
    type: "object",
    properties: {
        imagePath: {
            type: "string",
            maxLength: 255
        },
        brandModelId: {
            type: ["integer"],
            minimum: 1
        },
        manufactureYear: {
            type: ["integer"],
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
        "imagePath",
        "brandModelId",
        "manufactureYear",
        "paintColor"
    ],
    additionalProperties: true,
}

const IUpdatePhotoSchemaValidator = ajv.compile(IUpdatePhotoSchema);

export { IUpdatePhotoSchema };
export { IUpdatePhotoSchemaValidator };
export { IUpdatePhoto };