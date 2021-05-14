import * as express from 'express';

import BrandService from './brand.service';
import BrandModel from './brand.model';
import { ICreateBrand, ICreateBrandSchemaValidator } from './dto/ICreateBrand';
import { IUpdateBrand, IUpdateBrandSchemaValidator } from './dto/IUpdateBrand';
import IErrorResponse from '../../common/IErrorResponse.interface';

export default class BrandController {
    private brandService: BrandService;

    constructor(brandService: BrandService) {
        this.brandService = brandService;
    }

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.brandService.getAll());
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: BrandModel | null = await this.brandService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;

        if (!ICreateBrandSchemaValidator(item)) {
            res.status(400).send(ICreateBrandSchemaValidator.errors);
            return;
        }

        const newBrand: BrandModel | IErrorResponse = await this.brandService.create(item as ICreateBrand);

        res.send(newBrand);
    }

    async updateById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        const brandId = Number(req.params.id);

        if (brandId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        if (!IUpdateBrandSchemaValidator(item)) {
            res.status(400).send(IUpdateBrandSchemaValidator.errors);
            return;
        }

        const updatedBrand: BrandModel | IErrorResponse = await this.brandService.update(brandId, item as IUpdateBrand);

        if (updatedBrand == null) {
            res.status(404).send("The brand with that id does not exist");
            return;
        }

        res.send(updatedBrand);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const brandId = Number(req.params.id);

        if (brandId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.brandService.delete(brandId));
    }
}