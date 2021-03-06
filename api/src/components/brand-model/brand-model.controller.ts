import { Request, Response } from 'express';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BrandModel from './brand-model.model';
import BaseController from '../../services/BaseController';
import ICreateBrandModel, { ICreateBrandModelSchemaValidator } from './dto/ICreateBrandModel';
import IUpdateBrandModel, { IUpdateBrandModelSchemaValidator } from './dto/IUpdateBrandModel';
import ICreatePhoto from '../photo/dto/ICreatePhoto';
import { IUpdatePhoto } from '../photo/dto/IUpdatePhoto';

export default class BrandModelController extends BaseController {

    async getAllByBrandId(req: Request, res: Response) {
        const brandId: number = Number(req.params?.bid);
        if (!brandId) {
            res.status(401).send("Invalid ID value.");
            return;
        }
        const brand = await this.services.brandService.getById(brandId, { loadChildren: false });
        if (!brand) {
            res.status(404).send("There is no brand with that ID.");
            return;
        }
        res.send(await this.services.brandModelService.getAllByBrandId(brandId, { loadParent: false }));
    }

    async getById(req: Request, res: Response) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: BrandModel | null = await this.services.brandModelService.getById(id, { loadParent: true });

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: Request, res: Response) {
        const item = req.body;

        if (!ICreateBrandModelSchemaValidator(item)) {
            res.status(400).send(ICreateBrandModelSchemaValidator.errors);
            return;
        }

        const newBrandModel: BrandModel | IErrorResponse = await this.services.brandModelService.create(item as ICreateBrandModel);

        res.send(newBrandModel);
    }

    async addModelPhoto(req: Request, res: Response) {
        // parse data from req
        const item = JSON.parse(req.body?.data);

        const brandModelId: number = Number(req.params?.mid);
        if (!brandModelId || brandModelId <= 0) {
            res.sendStatus(404);
            return;
        }

        //upload photo and its path into db
        const uploadPhotos = await this.getUploadPhotos(req, res);
        if (uploadPhotos.length === 0) {
            return;
        }
        res.send(await this.services.brandModelService.addModelPhoto(item as ICreatePhoto, uploadPhotos[0]));
    }

    async updateById(req: Request, res: Response) {
        const item = req.body;
        const brandModelId = Number(req.params.id);

        if (brandModelId <= 0) {
            res.status(400).send(["The brand model ID must be a numerical value larger than 0."]);
            return;
        }

        if (!IUpdateBrandModelSchemaValidator(item)) {
            res.status(400).send(IUpdateBrandModelSchemaValidator.errors);
            return;
        }

        const updatedBrandModel: BrandModel | IErrorResponse = await this.services.brandModelService.update(brandModelId, item as IUpdateBrandModel);

        if (updatedBrandModel == null) {
            res.status(404).send("The model with that name does not exist");
            return;
        }
        res.send(updatedBrandModel);
    }

    async updateModelPhoto(req: Request, res: Response) {
        // parse data from req
        const item = req.body?.data;
        const brandModelId: number = Number(req.params?.mid);
        if (!brandModelId || brandModelId <= 0) {
            res.sendStatus(404);
            return;
        }

        //upload photo and its path into db
        const uploadPhotos = await this.getUploadPhotos(req, res);
        if (uploadPhotos.length === 0) {
            return;
        }
        res.send(await this.services.brandModelService.updateModelPhoto(item as IUpdatePhoto, uploadPhotos[0]));
    }

    async deleteById(req: Request, res: Response) {
        const brandModelId = Number(req.params.id);

        if (brandModelId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.services.brandModelService.delete(brandModelId));
    }
}
