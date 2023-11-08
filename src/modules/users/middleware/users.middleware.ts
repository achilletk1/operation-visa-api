import { validateCreateUser } from '../validation/users.validation';
import { Request, Response, NextFunction } from 'express';
import { User } from '../model/users.model';

export const validateCreateUserMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = validateCreateUser(req.body as User);
    if (error) {
        res.status(400).send(error.details[0].message);
    } else { next(); }
};