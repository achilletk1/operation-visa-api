import { responseWithAttachment } from 'common/helpers';
import { NextFunction, Request, Response } from 'express';
import { ExportService } from './export.service';

export class ExportController {

    static exportService: ExportService;

    constructor() { ExportController.exportService = new ExportService(); }

    async generateExportVisaTransactionLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateExportVisaTransactionLinks(req.query as any)); }
        catch (error) { next(error); }
    }

    async generateExportVisaTransactionData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateExportVisaTransactionData(req.params.code as string);
            responseWithAttachment(res, data.contentType, data.fileName, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateExportVisaAttachmentView(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateExportVisaAttachmentView(req.query as any)); }
        catch (error) { next(error); }
    }

    async generateExportAttachmentLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateExportAttachmentLinks(req.query as any)); }
        catch (error) { next(error); }
    }

    async generateExportVisaAttachmentData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateExportVisaAttachmentData(req.params.code as string);
            responseWithAttachment(res, data.contentType, data.fileName, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateExportBeacReportData(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateExportBeacReportData(req.params.id as any)); }
        catch (error) { next(error); }
    }

    async generateOnlinePaymentExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateOnlinePaymentExportLinks(req.query as any)); }
        catch (error) { next(error); }
    }

    async generateOnlinePaymentExporData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateOnlinePaymentExportData(req.params.code as string);
            responseWithAttachment(res, data.contentType, `online-payment_${new Date().getTime()}.xlsx`, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateOnlinePaymentOperationsExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateOnlinePaymentOperationsExportLinks(req.params.id as any)); }
        catch (error) { next(error); }
    }

    async generateOnlinePaymenOperationstExporData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateOnlinePaymentOperationsExportData(req.params.code as string);
            responseWithAttachment(res, data.contentType, `payment-operations_${new Date().getTime()}.xlsx`, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateTravelsCeillingExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateTravelsCeilingExportLinks(req.params.id as any)); }
        catch (error) { next(error); }
    }

    async generateTravelsCeillingExporData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateTravelsCeilingExportData(req.params.code as string);
            responseWithAttachment(res, data.contentType, `ceilling_${new Date().getTime()}.xlsx`, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateNotificationExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateNotificationExportLinks(req.params.id as string, req.query as any)); }
        catch (error) { next(error); }
    }

    async generateNotificationExportData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateNotificationExportData(req.params.id as string, req.params.code as string);
            responseWithAttachment(res, data.contentType, `ceilling_${new Date().getTime()}.xlsx`, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateTravelsExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateTravelsExportLinks(req.query as any)); }
        catch (error) { next(error); }
    }

    async generateTravelsExporData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateTravelsExportData(req.params.code as string);
            responseWithAttachment(res, data.contentType, `travels_${new Date().getTime()}.xlsx`, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateVisaTransactionsFilesExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateVisaTransactionsFilesExportLinks(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

    async generateVisaTransactionsFilesExporData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateVisaTransactionsFilesExportData(req.params.id as string, req.params.code as string);
            responseWithAttachment(res, data.contentType, data.fileName, data.fileContent);
        } catch (error) { next(error); }
    }

    async generateDeclarationFolderExportLinks(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ExportController.exportService.generateDeclarationFolderExportLinks(req.params.type as string, req.params.id as string)); }
        catch (error) { next(error); }
    }

    async generateDeclarationFolderExporData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ExportController.exportService.generateDeclarationFolderExportData(req.params.code as string);
            responseWithAttachment(res, data.contentType, data.fileName, data.fileContent);
        } catch (error) { next(error); }
    }

}
