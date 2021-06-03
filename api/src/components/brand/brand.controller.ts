import { Request, Response } from 'express';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';
import Brand from './brand.model';
import ICreateBrand, { ICreateBrandSchemaValidator } from './dto/ICreateBrand';
import IUpdateBrand, { IUpdateBrandSchemaValidator } from './dto/IUpdateBrand';

export default class BrandController extends BaseController {

    async getAll(req: Request, res: Response) {
        res.send(await this.services.brandService.getAll());
    }

    async getById(req: Request, res: Response) {
        const id: number = Number(req.params?.id);
        if (!id) {
            res.sendStatus(404);
            return;
        }
        const item: Brand | null = await this.services.brandService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: Request, res: Response) {
        const item = req.body;

        if (!ICreateBrandSchemaValidator(item)) {
            res.status(400).send(ICreateBrandSchemaValidator.errors);
            return;
        }

        const newBrand: Brand | IErrorResponse = await this.services.brandService.create(item as ICreateBrand);

        res.send(newBrand);
    }

    async updateById(req: Request, res: Response) {
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

        const updatedBrand: Brand | IErrorResponse = await this.services.brandService.update(brandId, item as IUpdateBrand);

        if (updatedBrand == null) {
            res.status(404).send("The brand with that ID does not exist");
            return;
        }

        res.send(updatedBrand);
    }

    async deleteById(req: Request, res: Response) {
        const brandId = Number(req.params.id);

        if (brandId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.services.brandService.delete(brandId));
    }
}
