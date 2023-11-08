import { NextFunction, Request, Response } from 'express';

export class DownloadsController {

    constructor() {}

    async downloadFile(req: Request, res: Response, next: NextFunction) {
        try {
            const file = `${__dirname}/files/BCI_hors_Cemac_202203.xlsx`;
            res.download(file);
        } catch (error) { next(error); }
    }

}