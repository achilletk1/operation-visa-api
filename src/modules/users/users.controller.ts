import { NextFunction, Request, Response } from 'express';
import { UsersService } from "./users.service";

export class UsersController {

    static usersService: UsersService;

    constructor() { UsersController.usersService = new UsersService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.findAll({ filter: req.query, projection: { password: 1, otp: 1 } })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.findOne({ filter: { _id: req.params.id }, projection: { password: 1, otp: 1 } })); }
        catch (error) { next(error); }
    }

    async getUserByOperations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.getUserByOperations()); }
        catch (error) { next(error); }
    }

    async getUserBy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.getUserBy(req.query)); }
        catch (error) { next(error); }
    }

    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.getUsers(req.query)); }
        catch (error) { next(error); }
    }

}
