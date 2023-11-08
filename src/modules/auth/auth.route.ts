
import { AuthController } from './auth.controller';
import express from 'express';

const router = express.Router();
export const authController = new AuthController();

router.post('/refresh', authController.generateNewToken);

router.post('/verify-credentials', authController.verifyCredentials);

router.post('/verify-otp', authController.verifyOtp);

router.post('/reset-default-pwd', authController.resetFirstPassword);

export const authRoute = router;