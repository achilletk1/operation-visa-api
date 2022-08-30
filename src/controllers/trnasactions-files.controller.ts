import { transactionsFIlesService } from '../services/transactions-files.service';
import { commonService } from '../services/common.service';
import { Request, Response } from 'express';


export const transactionsFilesController = {

    init: (app: any): void => {

        app.get('/visa-transactions', async (req: Request, res: Response) => {
            const data = await transactionsFIlesService.getVisaTransactions(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get visa transactions';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
    
        app.post('/visa-transactions/import/verify', async (req: Request, res: Response) => {
            const data = await transactionsFIlesService.verifyTransactionFiles(req.body);

            if ((data instanceof Error || data.index) && ['Forbbiden', 'IncorrectFileName', 'FileAlreadyExist', 'FileIsEmpty', 'IncorrectFileColumn', 'IncorrectFileMonth', 'IncorrectFileType'].includes(data.message)) {
                const { message } = data; let details, title;
                if (message === 'Forbbiden') { details = `Vous n'êtes pas autorisé à  effectuer cette opération`; title = 'Non autorisé' }
                if (message === 'IncorrectFileName') { details = `Le nom du fichier que vous avez importé est incorrect`; title = 'Nom du fichier incorrect' }
                if (message === 'FileAlreadyExist') { details = `Le fichier que vous avez importé existe déjà`; title = 'Fichier existant' }
                if (message === 'FileIsEmpty') { details = `Le fichier que vous avez importé est vide`; title = 'Fichier vide' }
                if (message === 'IncorrectFileColumn') { details = `Le fichier que vous avez importé ne contient pas la colonne ${data.index} qui est attendue`; title = 'Colonnes incorrectes' }
                if (message === 'IncorrectFileMonth') { details = `La champ "DATE" de la ligne ${data.index} ne correspond pas au mois du fichier`; title = 'Ligne de fichier incorrecte' }
                if (message === 'IncorrectFileType') { details = `Le champ "NATURE" de la ligne ${data.index} (${data.type}) ne correspond pas aux valeurs attendu, veuillez le remplacer par une nature de transaction connu`; title = 'type de transaction incorrecte' }
                const errResp = commonService.generateErrResponse(details, data, title);
                return res.status(403).json(errResp);
            }
            res.status(200).json(data);
        });

        app.put('/visa-transactions/import/confirm/:id', async (req: Request, res: Response) => {
            const data = await transactionsFIlesService.confirmTransactionFiles(req.params.id);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to post data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to post transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
            const traitment = await transactionsFIlesService.startTraitment(req.params.id);

            if (traitment instanceof Error) {
                await transactionsFIlesService.sendPostTransactionFileThreadError(req.params.id);
            }
        });

        app.put('/visa-transactions/import/restart/:id', async (req: Request, res: Response) => {
            const data = await transactionsFIlesService.restartConfirmTransactionFiles(req.params.id);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to post data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }
            if (data instanceof Error) {
                const message = 'unable to post transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.status(200).json(data);
            const traitment = await transactionsFIlesService.restartTraitment(req.params.id);
            if (traitment instanceof Error) {
                await transactionsFIlesService.sendPostTransactionFileThreadError(req.params.id);
            }
        });

        app.delete('/visa-transactions/import/abort/:id', async (req: Request, res: Response) => {
            const data = await transactionsFIlesService.abortTransactionFiles(req.params.id);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to post data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                await transactionsFIlesService.sendPostTransactionFileThreadError(req.params.id);
                const message = 'unable to post transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/visa-transactions/import/array/:id', async (req: Request, res: Response) => {
            const data = await transactionsFIlesService.getTransactionFilesDataArray(req.params.id);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to post data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to post transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

    }
};