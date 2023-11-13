import { ValidationsController } from './validations.controller';
import express from 'express';

const router = express.Router();
export const validationsController = new ValidationsController();

router.post('/user', validationsController.insertUserValidator);

router.get('/max-validation-level', validationsController.getMaxValidationLevel);

router.get('/user/:userId', validationsController.getUserValidatorById);

router.get('/get-otp/:userId', validationsController.getValidationOtp);

router.put('/:id', validationsController.insertValidation);

export const validationsRoute = router;