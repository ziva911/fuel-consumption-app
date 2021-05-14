import * as express from 'express';

import BrandModelService from './brand-model.service';
import BrandModel from './brand-model.model';
import { ICreateBrandModel, ICreateBrandModelSchemaValidator } from './dto/ICreateBrandModel';
import { IUpdateBrandModel, IUpdateBrandModelSchemaValidator } from './dto/IUpdateBrandModel';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BrandModelModel from './brand-model.model';

export default class BrandModelController {
    private brandModelService: BrandModelService;

    constructor(brandModelService: BrandModelService) {
        this.brandModelService = brandModelService;
    }

    async getAllByBrandId(req: express.Request, res: express.Response, next: express.NextFunction) {
        const brandId: number = Number(req.params?.brandid);
        res.send(await this.brandModelService.getAllByBrandId(brandId));
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: BrandModelModel | null = await this.brandModelService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;

        if (!ICreateBrandModelSchemaValidator(item)) {
            res.status(400).send(ICreateBrandModelSchemaValidator.errors);
            return;
        }

        const newBrandModel: BrandModelModel | IErrorResponse = await this.brandModelService.create(item as ICreateBrandModel);

        res.send(newBrandModel);
    }

    async updateById(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        const updatedBrandModel: BrandModelModel | IErrorResponse = await this.brandModelService.update(brandModelId, item as IUpdateBrandModel);

        if (updatedBrandModel == null) {
            res.status(404).send("The model with that name does not exist");
            return;
        }
        res.send(updatedBrandModel);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const brandModelId = Number(req.params.id);

        if (brandModelId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.brandModelService.delete(brandModelId));
    }
}