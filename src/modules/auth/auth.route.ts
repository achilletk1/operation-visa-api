
import { AuthController } from './auth.controller';
import express from 'express';

const router = express.Router();
export const authController = new AuthController();

router.post('/refresh', authController.generateNewToken);

router.post('/verify-credentials', authController.verifyCredentials);

router.post('/verify-otp', authController.verifyOtp);

router.post('/verify-credentials/user', authController.verifyCredentialsUser);

router.post('/send-client-otp', authController.sendClientOtp);

router.post('/verify-client-otp', authController.verifyClientOtp);

router.post('/reset-default-pwd', authController.resetFirstPassword);

router.get('/authorizations', authController.getAuthorizations);

export const authRoute = router;