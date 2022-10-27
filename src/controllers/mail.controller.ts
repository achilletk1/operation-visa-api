import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { mailService } from '../services/mail.service';


export const mailController = {
    init: (app: any): void => {
        app.post('/mails/view', async (req: Request, res: Response) => {
            const data = await mailService.generateExportView(req.body);
            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            return res.status(200).json(data);
        });
    }
};