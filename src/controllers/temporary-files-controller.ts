import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { temporaryFilesService } from '../services/temporary-files.service';

export const temporaryFilesController = {
    init: (app: any): void => {

        app.post('/temporary-files/', async (req: Request, res: Response) => {
            const data = await temporaryFilesService.insertTemporaryFile(req.body);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to insert temporary file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.put('/temporary-files/:id', async (req: Request, res: Response) => {
            const data = await temporaryFilesService.updateTemporaryFileById(req.params.id, req.body);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

    


    }
};