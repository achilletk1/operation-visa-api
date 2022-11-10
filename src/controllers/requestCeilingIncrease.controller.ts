import { requestCeillingIncreaseService } from "../services/requestCeilingIncrease.service";
import { commonService } from "../services/common.service";
import { Request, Response } from 'express';

export const requestCeillingIncreaseController = {

    init: (app: any): void => {

        app.post('/requestCeillingIncrease/', async (req: Request, res: Response) => {
            const data = await requestCeillingIncreaseService.insertRequestCeilling(req.body);

            if (data instanceof Error && ['ApplicationNotProcessed'].includes(data.message)) {
                const { message } = data;
                let details: string; let title = 'Erreur interne';
                if (message === 'ApplicationNotProcessed') { details = `Une demande pour ce compte est en cours de traitement`; title = 'Non autorisée' }
                const errResp = commonService.generateErrResponse(details, data, title);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const details = 'Erreur lors du traitement de la requête';
                const errResp = commonService.generateErrResponse(details, data, 'erreur interne');
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/requestCeillingIncrease', async (req: Request, res: Response) => {
            const data = await requestCeillingIncreaseService.getRequestCeillingIncrease(req.query);

            if (data instanceof Error) {
                const message = 'get request ceilings failed failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.status(200).json(data);
        });

        app.put('/validate-request/:id', async (req: Request, res: Response) => {

            const { id } = req.params;
            const data = await requestCeillingIncreaseService.RequestIncrease(id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error && ['CeilingNotFound', 'AllReadyValidate'].includes(data.message)) {
                let message: string;
                if (data.message === 'CeilingNotFound') { message = `Plafond non trouvé !`; }
                if (data.message === 'AllReadyValidate') { message = `Une validation a déjà été effectué, Impossible de valider la demande !`; }
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = `Une erreur est survenue lors de la validation de la demande d'augmentation de plafond`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }


            res.status(200).json(data);
        });

        app.put('/validate-request/:id/assign', async (req: Request, res: Response) => {
            const data = await requestCeillingIncreaseService.assignRequestCeiling(req.params.id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'Operation forbidden';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error && data.message === 'CeilingNotFound') {
                const message = 'ceiling request not found';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error && data.message === 'AlreadyAssigned') {
                const message = 'ceiling already assigned';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error && data.message === 'AssignedUserNotProvied') {
                const message = 'Assigned user not provied';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'Assignment feedback failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'FeedBack assigned.' });
        });
    }
};