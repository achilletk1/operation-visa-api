import { ValidationsController } from './validations.controller';
import express from 'express';

const router = express.Router();
export const validationsController = new ValidationsController();

router.post('/user', validationsController.insertUserValidator);

router.get('/user/:userId', validationsController.getUserValidatorById);

router.get('/:userId/get-otp', validationsController.getValidationOtp);

router.get('/max-validation-level', validationsController.getMaxValidationLevel);

router.put('/:id', validationsController.insertvalidation);

export const validationsRoute = router;