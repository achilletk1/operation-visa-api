import { NextFunction, Request, Response } from 'express';
import { UsersService } from "./users.service";

export class UsersController {

    static usersService: UsersService;

    constructor() { UsersController.usersService = new UsersService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.findAll({ filter: req.query, projection: { password: 0, otp: 0 } })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.findOne({ filter: { _id: req.params.id }, projection: { password: 0, otp: 0 } })); }
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

    async verifyLdapUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.verifyLdapUser(req.query)); }
        catch (error) { next(error); }
    }

    async createUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.createUser(req.body)); }
        catch (error) { next(error); }
    }

    async updateUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.updateUser(req.body)); }
        catch (error) { next(error); }
    }
    
    async generateUsersExportLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await UsersController.usersService.generateUsersExportLinks(req.query)); }
        catch (error) { next(error); }
    }

    async generateUsersExporData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { 
            const data = await UsersController.usersService.generateUsersExporData(req.params.code);

            res.setHeader('Content-Type', data?.contentType);
            res.setHeader('Content-Disposition', `attachment; filename=users_list_${new Date().getTime()}.xlsx`);
            res.send(data.fileContent);
        }
        catch (error) { next(error); }
    }

}
