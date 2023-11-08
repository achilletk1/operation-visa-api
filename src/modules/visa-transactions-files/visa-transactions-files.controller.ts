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

}