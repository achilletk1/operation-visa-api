import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { validationService } from '../services/validation.service';


export const validationController = {

    init: (app: any): void => {

        app.post('/validations/user', async (req: Request, res: Response) => {

            const data = await validationService.insertUserValidator(req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to post validation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }


            res.status(200).json({ message: 'New validation inserted.' });
        });

        app.put('/validations/:id', async (req: Request, res: Response) => {

            const data = await validationService.insertvalidation(req.params.id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to post validation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }


            res.status(200).json({ message: 'New validation inserted.' });
        });

        app.get('/validations/user/:userId', async (req: Request, res: Response) => {
            const data = await validationService.getUserValidatorById(req.params.userId);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get user validator';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/validations/:userId/get-otp', async (req: Request, res: Response) => {
            const data = await validationService.getValidationOtp(req.params.userId);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get otp for validation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/validations/max-validation-level', async (req: Request, res: Response) => {
            const data = await validationService.getMaxValidationLevel();

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get max validation level';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });


    }
}