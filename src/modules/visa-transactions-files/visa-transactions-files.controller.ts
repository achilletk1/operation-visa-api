import { VisaTransactionsFilesService } from "./visa-transactions-files.service";
import { NextFunction, Request, Response } from 'express';
import { FilesController } from "./files";

export class VisaTransactionsFilesController {

    static visaTransactionsFilesService: VisaTransactionsFilesService;
    filesController: FilesController;

    constructor() {
        VisaTransactionsFilesController.visaTransactionsFilesService = new VisaTransactionsFilesService();
        this.filesController = new FilesController();
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async getVisaTransactionsFilesLabels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send((await VisaTransactionsFilesController.visaTransactionsFilesService.findAll({ projection: { label: 1, _id: 0 } }))?.data); }
        catch (error) { next(error); }
    }

    async verifyTransactionFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.verifyTransactionFiles(req.body)); }
        catch (error) { next(error); }
    }

    async confirmTransactionFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.confirmTransactionFiles(req.params.id)); }
        catch (error) { next(error); }
    }

    async abortTransactionFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.abortTransactionFiles(req.params.id)); }
        catch (error) { next(error); }
    }

    async getTransactionFilesDataArray(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.getTransactionFilesDataArray(req.params.id)); }
        catch (error) { next(error); }
    }

    async getVisaTransactionsFilesColumnTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsFilesController.visaTransactionsFilesService.getVisaTransactionsFilesColumnTitles()); }
        catch (error) { next(error); }
    }

}