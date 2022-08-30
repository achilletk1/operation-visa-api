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

        app.post('/users', async (req: Request, res: Response) => {

            const data = await usersService.insertUser(req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error && ['UserAllreadyCreated', 'UserCodeAllreadyUsed'].includes(data.message)) {
                let message: string;
                if (data.message === 'UserCodeAllreadyUsed') { message = `Identifiant de connexion déjà utilisé, veuillez entrer un autre !`; }
                if (data.message === 'UserAllreadyCreated') { message = `Matricule client déjà utilisé pour la création d'un utilisateur BCIONLINE`; }
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = `Une erreur est survenue lors de la création de l'utilisateur`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'New user inserted.' });
        });

        app.put('/users/reset-pwrd', async (req: Request, res: Response) => {
            const { userId } = req.body;

            const data = await usersService.ResetPwrd(userId);
            if (data instanceof Error) {
                const message = 'Reset password user failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'Password user Reset.' });
        });

        app.put('/users/:id', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await usersService.updateUser(id, req.body, req.query);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update user failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'New user inserted.' });
        });

    }

};


