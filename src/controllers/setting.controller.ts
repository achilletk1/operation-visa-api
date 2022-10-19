import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { settingService } from '../services/setting.service';


export const SettingController = {

    init: (app: any): void => {
              
        app.get('/setting/:key', async (req: Request, res: Response) => {
            const data = await settingService.getSettingByKey(req.params.key);


            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get setting by key';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.put('/settings/:id', async (req: Request, res: Response) => {
            const { id } = req.params;
            const data = await settingService.updateSettingById(id, req.body);
            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'Forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'Update setting failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'setting data updated succesfully.' });
        });

        
      /*  app.post('/settings', async (req: Request, res: Response) => {

            const data = await settingService.insertSetting(req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }
            res.status(200).json({ message: 'New Setting inserted.' });
        });


        app.get('/settings', async (req: Request, res: Response) => {
            const data = await settingService.getSettings(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get setting';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
      
        app.get('/settings/all', async (req: Request, res: Response) => {
            const data = await settingService.getSettingsBy(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get Setting ';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
        */

    }
};