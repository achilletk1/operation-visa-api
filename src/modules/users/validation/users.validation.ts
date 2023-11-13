import Joi, { ValidationResult } from 'joi';
import { User } from '../model/users.model';

export const validateCreateUser = (user: User): ValidationResult => {
    const schema = Joi.object({
        userCode: Joi.string().required(),
        visaOpecategory: Joi.number().required(),
    });

    return schema.validate(user);
};