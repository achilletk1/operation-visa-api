import { visaTransactionsFilesService } from '../services/visa-transactions-files.service';
import { commonService } from '../services/common.service';
import { Request, Response } from 'express';


export const visaTransactionsFilesController = {

    init: (app: any): void => {

        app.get('/visa-transactions-files', async (req: Request, res: Response) => {
            const data = await visaTransactionsFilesService.getVisaTransactionsFiles(req.query);

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

        app.get('/visa-transactions-files/:id', async (req: Request, res: Response) => {
            const data = await visaTransactionsFilesService.getVisaTransactionsFilesById(req.params.id);


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

        app.get('/visa-transactions-files/:id/export/:code', async (req: Request, res: Response) => {
            const id = req.params.id;
            const code = req.params.code;

            const data = await visaTransactionsFilesService.generateExportData(id, code);

            if (data instanceof Error) {
                const message = 'unable to get company invoices';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${data.fileName}`);
            return res.send(data.fileContent);
        });

        app.post('/visa-transactions-files/:id/export', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await visaTransactionsFilesService.generateExportLinks(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

    }
};