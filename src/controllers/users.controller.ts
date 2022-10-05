import { commonService } from '../services/common.service';
import { usersService } from '../services/users.service';
import { Request, Response } from 'express';

export const usersController = {

    init: (app: any): void => {

        app.get('/users/:id', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await usersService.getUserById(id);

            if (data instanceof Error) {
                const message = 'error while getting user';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/user', async (req: Request, res: Response) => {
            const data = await usersService.getUserBy(req.query);

            if (data instanceof Error) {
                const message = 'error while getting user';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/users', async (req: Request, res: Response) => {
            const data = await usersService.getUsers(req.query);
            if (data instanceof Error && (data.message === 'Forbidden')) {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }
            res.status(200).json(data);
        });

        app.get('/users/visa-operations/all', async (req: Request, res: Response) => {
            const data = await usersService.getUserByOperations(req.query);
            if (data instanceof Error && (data.message === 'Forbidden')) {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }
            res.status(200).json(data);
        });


    }

};


