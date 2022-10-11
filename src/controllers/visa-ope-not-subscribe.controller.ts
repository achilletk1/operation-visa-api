import { travelService } from './../services/travel.service';
import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { voucherService } from '../services/voucher.service';
import { longTravelTypesService } from '../services/long-travel-types.service';
import { onlinePaymentsService } from '../services/online-payment.service';
import { propertyAndServicesTypesService } from '../services/property-and-services-types.service';


export const visaOpeNotSubscribeController = {

    init: (app: any): void => {

        // TRAVEL ENDPOINTS

        app.post('/visa-operations/not-customer/travels', async (req: Request, res: Response) => {

            const data = await travelService.insertTravel(req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }
            res.status(200).json({ message: 'New travel inserted.' });
        });


        app.get('/visa-operations/not-customer/travels', async (req: Request, res: Response) => {
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


        app.get('/visa-operations/not-customer/travels/all', async (req: Request, res: Response) => {
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

        app.get('/visa-operations/not-customer/travels/:id', async (req: Request, res: Response) => {
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

        app.put('/visa-operations/not-customer/travels/:id', async (req: Request, res: Response) => {
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

        app.put('/visa-operations/not-customer/travels/:id/status', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await travelService.updateTravelStatusById(id, req.body);

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

        app.get('/visa-operations/not-customer/travels/:id/attachements/export/:code', async (req: Request, res: Response) => {
            const id = req.params.id;
            const code = req.params.code;

            const data = await travelService.generateExportData(id, code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${data.fileName}`);
            return res.send(data.fileContent);
        });

        app.post('/visa-operations/not-customer/travels/:id/attachements/export', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await travelService.generateExportLinks(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.put('/visa-operations/not-customer/travels/:id/attachements/insert', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await travelService.postAttachment(id, req.query, req.body);

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


        app.put('/visa-operations/not-customer/travels/:id/attachements/update', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await travelService.updateAttachment(id, req.query, req.body);

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


        app.put('/visa-operations/not-customer/travels/:id/steps/status', async (req: Request, res: Response) => {
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


        app.post('/visa-operations/not-customer/travels/:id/attachements/view', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await travelService.generateExportView(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        // VOUCHER ENDPOINTS

        app.post('/visa-operations/not-customer/vouchers/', async (req: Request, res: Response) => {
            const data = await voucherService.insertVoucher(req.body);

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

        app.get('/visa-operations/not-customer/vouchers/', async (req: Request, res: Response) => {
            const data = await voucherService.getVouchers(req.query);

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

        app.get('/visa-operations/not-customer/vouchers/all', async (req: Request, res: Response) => {
            const data = await voucherService.getVoucherBy(req.query);

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

        app.get('/visa-operations/not-customer/vouchers/:id', async (req: Request, res: Response) => {
            const data = await voucherService.getVoucherById(req.params.id);


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

        app.put('/visa-operations/not-customer/vouchers/:id', async (req: Request, res: Response) => {
            const data = await voucherService.updateVoucherById(req.params.id, req.body);

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

        app.delete('/visa-operations/not-customer/vouchers/:id', async (req: Request, res: Response) => {
            const data = await voucherService.deleteVoucher(req.params.id);

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


        //LONG TRAVEL ENDPOINTS

        app.post('/visa-operations/not-customer/long-travel-types/', async (req: Request, res: Response) => {
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

        app.get('/visa-operations/not-customer/long-travel-types/', async (req: Request, res: Response) => {
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

        app.get('/visa-operations/not-customer/long-travel-types/:id', async (req: Request, res: Response) => {
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

        app.put('/visa-operations/not-customer/long-travel-types/:id', async (req: Request, res: Response) => {
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

        app.delete('/visa-operations/not-customer/long-travel-types/:id', async (req: Request, res: Response) => {
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

           //ONLINE PAYMENT ENDPOINTS

        app.put('/visa-operations/not-customer/online-payments/:id', async (req: Request, res: Response) => {

            const data = await onlinePaymentsService.insertOnlinePaymentStatement(req.params.id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to post online payment Statement';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.status(200).json(data);
        });


        app.get('/visa-operations/not-customer/online-payments', async (req: Request, res: Response) => {
            const data = await onlinePaymentsService.getOnlinePayments(req.query);

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

        app.get('/visa-operations/not-customer/online-payments/all', async (req: Request, res: Response) => {
            const data = await onlinePaymentsService.getOnlinePaymentsBy(req.query);

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

        app.get('/visa-operations/not-customer/online-payments/:id', async (req: Request, res: Response) => {
            const data = await onlinePaymentsService.getOnlinePaymentById(req.params.id);


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

        app.put('/visa-operations/not-customer/online-payments/update/:id', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await onlinePaymentsService.updateOnlinePaymentsById(id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update online payment failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'online payment data updated succesfully.' });
        });


        app.put('/visa-operations/not-customer/online-payments/:id/status', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await onlinePaymentsService.updateAttachmentStatus(id, req.body);

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

        app.get('/visa-operations/not-customer/online-payments/:id/attachements/export/:code', async (req: Request, res: Response) => {
            const id = req.params.id;
            const code = req.params.code;

            const data = await onlinePaymentsService.generateExportData(id, code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${data.fileName}`);
            return res.send(data.fileContent);
        });

        app.post('/visa-operations/not-customer/online-payments/:id/attachements/export', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await onlinePaymentsService.generateExportLinks(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });


        app.post('/visa-operations/not-customer/online-payments/:id/attachements/view', async (req: Request, res: Response) => {

            const data = await onlinePaymentsService.generateExportView(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.put('/visa-operations/not-customer/travels/:id/attachements/insert', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await onlinePaymentsService.postAttachment(id, req.query, req.body);

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

        //PROPERTY AND SERVICE ENDPOINTS

        app.post('/visa-operations/not-customer/properties-and-services/', async (req: Request, res: Response) => {
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

        app.get('/visa-operations/not-customer/properties-and-services/', async (req: Request, res: Response) => {
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

        app.get('/visa-operations/not-customer/properties-and-services-all', async (req: Request, res: Response) => {
            const data = await propertyAndServicesTypesService.getPropertyAndServicesTypesBy(req.query);

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

        app.get('/visa-operations/not-customer/properties-and-services/:id', async (req: Request, res: Response) => {
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

        app.put('/visa-operations/not-customer/properties-and-services/:id', async (req: Request, res: Response) => {
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

        app.delete('/visa-operations/not-customer/properties-and-services/:id', async (req: Request, res: Response) => {
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