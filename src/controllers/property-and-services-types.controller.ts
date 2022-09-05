import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { propertyAndServicesTypesService } from '../services/property-and-services-types.service';


export const propertyAndServicesTypesController = {
    init: (app: any): void => {


        app.post('/properties-and-services/', async (req: Request, res: Response) => {
            const data = await propertyAndServicesTypesService.insertPropertyAndServicesTypes(req.body);

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

        app.get('/properties-and-services/', async (req: Request, res: Response) => {
            const data = await propertyAndServicesTypesService.getPropertyAndServicesTypes(req.query);

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

        app.get('/properties-and-services/:id', async (req: Request, res: Response) => {
            const data = await propertyAndServicesTypesService.getPropertyAndServicesTypesById(req.params.id);


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

        app.put('/properties-and-services/:id', async (req: Request, res: Response) => {
            const data = await propertyAndServicesTypesService.updatePropertyAndServicesTypesById(req.params.id, req.body);

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

        app.delete('/properties-and-services/:id', async (req: Request, res: Response) => {
            const data = await propertyAndServicesTypesService.deletePropertyAndServicesType(req.params.id);

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