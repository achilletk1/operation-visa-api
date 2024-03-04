
import { VisaRecapOperationService } from './visa-recap-operation-statement.service';
import { NextFunction, Request, Response } from 'express';
import { MailAttachment } from 'modules/notifications';

export class VisaRecapOperationsController {

    static visaRecapOperationsService: VisaRecapOperationService;

    constructor() { VisaRecapOperationsController.visaRecapOperationsService = new VisaRecapOperationService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaRecapOperationsController.visaRecapOperationsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async getExportRecapOperationXls(req: Request, res: Response, next: NextFunction) {
        try {
            const result: MailAttachment[] | any = await VisaRecapOperationsController.visaRecapOperationsService.exportOperationRecap(req.params.code as string)
            res.setHeader('Content-Type', result[0]?.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${result[0]?.name}.xlsx`);
            res.send(result[0]?.content);
        } catch (error) { next(error); }
    }

    async getExportXlsLink(req: Request, res: Response, next: NextFunction) {
        try {
            res.send(await VisaRecapOperationsController.visaRecapOperationsService.generateXlsLink(req.query?.recapId as string));
        } catch (error) { next(error); }
    }

}