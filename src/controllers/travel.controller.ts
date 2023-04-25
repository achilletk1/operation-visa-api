import { travelService } from './../services/travel.service';
import { commonService } from '../services/common.service';
import { Request, Response } from 'express';


export const travelController = {

    init: (app: any): void => {
        app.post('/travels', async (req: Request, res: Response) => {

            const data = await travelService.insertTravel(req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to post travel';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }


            res.status(200).json({ message: 'New travel inserted.' });
        });


        app.get('/travels', async (req: Request, res: Response) => {
            const data = await travelService.getTravels(req.query);

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


        app.get('/travels/all', async (req: Request, res: Response) => {
            const data = await travelService.getTravelsBy(req.query);

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

        app.get('/travels/:id', async (req: Request, res: Response) => {
            const data = await travelService.getTravelById(req.params.id);


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

        app.put('/travels/:id', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await travelService.updateTravelById(id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update travel failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'travel data updated succesfully.' });
        });


        app.put('/travels/:id/steps/status', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await travelService.updateTravelStepStatusById(id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update travel failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'travel data updated succesfully.' });
        });

        app.get('/validators-travel/:id', async (req: Request, res: Response) => {

            const data = await travelService.getValidationsTravel(req.params.id);
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

        app.get('/travels/transactions/range', async (req: Request, res: Response) => {
            const data = await travelService.getTravelRangesTransactions(req.query);


            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get travels transactions';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/export/travels', async (req: Request, res: Response) => {
            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await travelService.generateTravelsExportLinks(req.query);

            if (data instanceof Error && data.message === 'travelsNotFound') {
                const message = 'Aucun voyage trouvé pour cette transaction';
                const errResp = commonService.generateErrResponse(message, data, 'Aucune donnée');
                return res.status(404).json(errResp);
            }
            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            return res.status(200).json(data);
        });

        app.get('/export/travels/:code', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await travelService.generateTravelsExporData(code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename=travels_${new Date().getTime()}.xlsx`);
            return res.send(data.fileContent);
        });

      
    }
}