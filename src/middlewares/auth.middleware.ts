import { Request, NextFunction } from 'express';
import * as httpContext from 'express-http-context';
import { logger } from '../winston';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { encode } from 'js-base64';

export const whiteList: { path: string, method?: string }[] = [
    { path: '/auth', method: 'POST' },
    { path: '/downloads', method: 'GET' },
    { path: '/status', method: 'GET' },
    { path: '/auth/verify-credentials', method: 'POST' },
    { path: '/auth/verify-otp', method: 'POST' },
    { path: '/auth/reset-default-pwd', method: 'POST' },
    { path: '/auth/reset-default-pwd', method: 'GET' },
    { path: '/export', method: 'GET' },
    { path: '/captcha', method: 'GET' },
    { path: '/images', method: 'GET' },
    { path: '/visa-operations/not-customer', method: 'GET' },
    { path: '/visa-operations/not-customer', method: 'POST' },
];



export async function oauthVerification(req: Request, res: any, next: NextFunction) {

    const index = whiteList.findIndex(elt => req.path.includes(elt.path) && req.method === elt.method);
    if (index >= 0) { return next(); }

    if (req.path.includes('/visa-operations/not-customer')) {
        const token = `Basic ${encode('LNDBCINETADMIN:LNDp@ssw0rd')}`;
        if (token === req.headers.authorization) {
            return next();
        }
    }

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.includes(' ') || authorization.split(' ').length < 2) {
        return res.status(400).json({ message: 'missing or bad formatted token' });
    }

    const accessToken = authorization.split(' ')[1];

    try {
        const payloadata: any = jwt.verify(accessToken, `${config.get('oauthSalt')}`);
        delete payloadata.exp;
        delete payloadata.iat;
        const user = payloadata.payload;
        httpContext.set('user', user);

        next();
    } catch (error) {
        if (error.message === 'TokenExpired') {
            logger.error(`\nToken expired.`, error);
            return res.status(401).json({ type: 'TokenExpired' });
        }
        logger.error(`\nInvalid token.`, error);
        res.status(401).json({ message: 'invalid token.' });
    }

};

export default { oauthVerification, whiteList };