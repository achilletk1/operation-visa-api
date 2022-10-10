import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { longTravelTypesService } from '../services/long-travel-types.service';


export const longTravelTypesController = {
    init: (app: any): void => {


        app.post('/long-travel-types/', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.insertLongTravelTypes(req.body);

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

        app.get('/long-travel-types/', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypes(req.query);

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

        app.get('/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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
        
        app.get('/visa-operations/not-customer/long-travel-types/all', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesBy(req.query);


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

        app.get('/long-travel-types/:id', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.getLongTravelTypesById(req.params.id);


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

        app.put('/long-travel-types/:id', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.updateLongTravelTypesById(req.params.id, req.body);

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

        app.delete('/long-travel-types/:id', async (req: Request, res: Response) => {
            const data = await longTravelTypesService.deleteLongTravelType(req.params.id);

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