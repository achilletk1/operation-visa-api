import { Request, Response } from 'express';

export const downloadsController = {

    init: (app: any): void => {
        
        app.get('/downloads/visa-transactions-file/xlsx/default', async (req: Request, res: Response) => {
            const file = `${__dirname}/../upload-folder/BCI_hors_Cemac_202203.xlsx`;
            res.download(file); // Set disposition and send it.
        });

    }
};