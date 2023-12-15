import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {

    static authService: AuthService;

    constructor() { AuthController.authService = new AuthService(); }

    async generateNewToken(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.generateNewToken(req.body?.refresh_token as any)); }
        catch (error) { next(error); }
    }

    async verifyCredentials(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.verifyCredentials(req.body as any)); }
        catch (error) { next(error); }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.verifyOtp(req.body as any)); }
        catch (error) { next(error); }
    }


    async verifyCredentialsUser(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.verifyCredentialsUser(req.body as any)); }
        catch (error) { next(error); }
    }

    async sendClientOtp(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.sendClientOtp(req.body as any)); }
        catch (error) { next(error); }
    }

    async verifyClientOtp(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.verifyClientOtp(req.body as any)); }
        catch (error) { next(error); }
    }

    async resetFirstPassword(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.resetFirstPassword(req.body as any)); }
        catch (error) { next(error); }
    }

    async getAuthorizations(req: Request, res: Response, next: NextFunction) {
        try { res.send(await AuthController.authService.getAuthorizations()); }
        catch (error) { next(error); }
    }


}
