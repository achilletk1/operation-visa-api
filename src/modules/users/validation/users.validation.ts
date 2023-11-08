import Joi, { ValidationResult } from 'joi';
import { User } from '../model/users.model';

export const validateCreateUser = (user: User): ValidationResult => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
    });

    return schema.validate(user);
};