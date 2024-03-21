import Joi, { ValidationResult } from 'joi';
import { User } from '../model/users.model';

export const validateCreateUser = (user: User): ValidationResult => {
    const schema = Joi.object({
        clientCode: Joi.string().required(),
        // visaOpeCategory: Joi.number().required(),
    });

    return schema.validate(user);
};