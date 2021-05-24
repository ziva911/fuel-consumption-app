import { Request, Response, NextFunction } from 'express';
import { ICreateAdministrator, ICreateAdministratorSchemaValidator } from './dto/ICreateAdministrator';
import IErrorResponse from '../../common/IErrorResponse.interface';
import BaseController from '../../services/BaseController';
import Administrator from './administrator.model';
import { IUpdateAdministratorSchemaValidator, IUpdateAdministrator } from './dto/IUpdateAdministrator';

export default class AdministratorController extends BaseController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.administratorService.getAll());
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: number = Number(req.params?.id);

        if (!id) {
            res.sendStatus(404);
            return;
        }

        const item: Administrator | null = await this.services.administratorService.getById(id);

        if (item == null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const item = req.body;

        if (!ICreateAdministratorSchemaValidator(item)) {
            res.status(400).send(ICreateAdministratorSchemaValidator.errors);
            return;
        }

        const newAdmin: Administrator | IErrorResponse = await this.services.administratorService.create(item as ICreateAdministrator);

        res.send(newAdmin);
    }

    async updateById(req: Request, res: Response, next: NextFunction) {
        const item = req.body;
        const adminId = Number(req.params.id);

        if (adminId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        if (!IUpdateAdministratorSchemaValidator(item)) {
            res.status(400).send(IUpdateAdministratorSchemaValidator.errors);
            return;
        }

        const updatedAdmin: Administrator | IErrorResponse = await this.services.administratorService.update(adminId, item as IUpdateAdministrator);

        if (updatedAdmin == null) {
            res.status(404).send("The brand with that id does not exist");
            return;
        }

        res.send(updatedAdmin);
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        const adminId = Number(req.params.id);

        if (adminId <= 0) {
            res.status(400).send(["The brand ID must be a numerical value larger than 0."]);
            return;
        }

        res.send(await this.services.administratorService.delete(adminId));
    }
}