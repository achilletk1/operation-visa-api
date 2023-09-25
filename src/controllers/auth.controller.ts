import { commonService } from '../services/common.service';
import { authService } from '../services/auth.service';
import { Request, Response } from 'express';
import { logger } from '../winston';

export const authController = {

    init: (app: any): void => {

        app.post('/auth/refresh', async (req: Request, res: Response) => {
            const refreshToken = req.body.refresh_token;
            const data = await authService.generateNewToken(refreshToken);
            if (data instanceof Error) {
                const message = 'bad token submitted';
                return res.status(400).json({ message });
            }
            return res.status(200).json(data);
        });

        app.post('/auth/verify-credentials', async (req: Request, res: Response) => {
            const { userCode, password } = req.body;
            const data = await authService.verifyCredentials({ userCode, password });

            if (data instanceof Error && data.message === 'UserNotFound') {
                const message = 'user not found.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(404).json(errResp);
            }

            if (data instanceof Error && data.message === 'BadPassword') {
                const message = 'bad credentials.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error && data.message === 'disableUser') {
                const message = 'unauthorized user.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(402).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'error while getting user';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }


            res.status(200).json(data);
        });

        app.post('/auth/verify-otp', async (req: Request, res: Response) => {
            const { userCode, otp } = req.body;
            const data = await authService.verifyOtp(userCode, otp);

            if (data instanceof Error && data.message === 'MissingAuthData') {
                const message = 'missig auth parameters.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(400).json(errResp);
            }

            if (data instanceof Error && data.message === 'BadOTP') {
                const message = 'bad otp format.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(400).json(errResp);
            }

            if (data instanceof Error && data.message === 'UserNotFound') {
                const message = 'user not found.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(404).json(errResp);
            }

            if (data instanceof Error && data.message === 'OTPNoMatch') {
                const message = 'unknow otp provided.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error && data.message === 'OTPExpired') {
                const message = 'expired otp provided.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'error while getting user';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.post('/auth/reset-default-pwd', async (req: Request, res: Response) => {
            const { userCode, currentPwd, newPwd, confirmPwd } = req.body;

            const data = await authService.resetFirstPassword(userCode, currentPwd, newPwd, confirmPwd);

            if (data instanceof Error && data.message === 'EmailOrPasswordNotProvided') {
                const message = 'bad request';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(400).json(errResp);
            }

            if (data instanceof Error && data.message === 'UserNotFound') {
                const message = 'user not found';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(404).json(errResp);
            }


            if (data instanceof Error && data.message === 'otpMissMatch') {
                const message = 'Otp code miss match';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error
                && (
                    data.message === 'FailedResetPassword'
                    || data.message === 'PasswordsProvidedAreDifferent'
                    || data.message === 'Passwordalreadyused'
                )
            ) {
                const message = 'bad passwords';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(400).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'something went wrong';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json({ message });
            }

            res.status(200).json(data);
        });

    }
}
