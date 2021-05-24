import IApplicationResources from '../common/IApplicationResources.interface';
import IServices from '../common/IServices.interface';
import { IUploadPhoto } from '../components/photo/dto/ICreatePhoto';
import { UploadedFile } from 'express-fileupload';
import * as fs from 'fs';
import * as path from 'path';
import sizeOf from 'image-size';
import sharp = require('sharp');
import { v4 as uuidv4 } from 'uuid';
import Config from '../config/dev';
import { Request, Response } from 'express';

export default class BaseController {
    private resources: IApplicationResources;

    constructor(resources: IApplicationResources) {
        this.resources = resources;
    }

    protected get services(): IServices {
        return this.resources.services;
    }

    private isImageValid(file: UploadedFile): { isOk: boolean; message?: string; } {
        const size = sizeOf(file.tempFilePath);
        if (size.width < Config.fileUploadOptions.photos.limits.minWidth) {
            fs.unlinkSync(file.tempFilePath);
            return {
                isOk: false,
                message: `Image width should be at least ${Config.fileUploadOptions.photos.limits.minWidth} px.`
            }
        }
        if (size.height < Config.fileUploadOptions.photos.limits.minHeight) {
            fs.unlinkSync(file.tempFilePath);
            return {
                isOk: false,
                message: `Image height should be at least ${Config.fileUploadOptions.photos.limits.minHeight} px.`
            }
        }
        if (size.width > Config.fileUploadOptions.photos.limits.maxWidth) {
            fs.unlinkSync(file.tempFilePath);
            return {
                isOk: false,
                message: `Image width should less than ${Config.fileUploadOptions.photos.limits.maxWidth} px.`
            }
        }
        if (size.height > Config.fileUploadOptions.photos.limits.maxHeight) {
            fs.unlinkSync(file.tempFilePath);
            return {
                isOk: false,
                message: `Image height should be less than: ${Config.fileUploadOptions.photos.limits.maxHeight} px.`
            }
        }
        return {
            isOk: true
        }
    }

    private async resizeUploadImage(directory: string, filename: string) {
        for (const resizeSpecification of Config.fileUploadOptions.photos.resizings) {
            const parsedFileName = path.parse(filename);
            const namePart = parsedFileName.name;
            const extPart = parsedFileName.ext;
            await sharp(directory + filename)
                .resize({
                    width: resizeSpecification.width,
                    height: resizeSpecification.height,
                    fit: resizeSpecification.fit,
                    withoutEnlargement: true,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .toFile(directory + namePart + resizeSpecification.sufix + extPart);

        }
    }

    protected async getUploadPhotos(req: Request, res: Response): Promise<IUploadPhoto[]> {
        const photos: IUploadPhoto[] = [];

        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You can upload a maximum of " + Config.fileUploadOptions.maxFiles + " photos.")
            return [];
        }
        const fileKeys = Object.keys(req.files);

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as UploadedFile;

            const imageValidation = this.isImageValid(file);

            if (imageValidation.isOk === false) {
                res.status(400).send(`Error width image ${fileKey}: ${imageValidation?.message}.`);
                return [];
            }

            const now = new Date();
            const randomNameSegment = uuidv4();
            const uploadDirectory = Config.fileUploadOptions.uploadDestinationDirectory +
                (Config.fileUploadOptions.uploadDestinationDirectory.endsWith('/') ? '' : '/') +
                randomNameSegment + "-" +
                now.getFullYear() + '/' +
                ((now.getMonth() + 1) + "").padStart(2, "0") + '/';
            const filename = randomNameSegment + "-" + file?.name;
            const uploadDestination = uploadDirectory + filename;

            await file.mv(uploadDestination);
            await this.resizeUploadImage(uploadDirectory, filename);

            photos.push({
                imagePath: uploadDestination,
            });
        }
        return photos;
    }
}
