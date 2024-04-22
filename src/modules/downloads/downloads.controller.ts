import { NextFunction, Request, Response } from 'express';

export class DownloadsController {

    constructor() {}

    async downloadFileTerminals(req: Request, res: Response, next: NextFunction) {
        try {
            const file = `${__dirname}/files/BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202203.xlsx`;
            res.download(file);
        } catch (error) { next(error); }
    }

    async downloadFileInternet(req: Request, res: Response, next: NextFunction) {
        try {
            const file = `${__dirname}/files/BICEC_INTERNET_SEUIL_1M_202203.xlsx`;
            res.download(file);
        } catch (error) { next(error); }
    }

}