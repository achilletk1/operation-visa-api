import { getAuthorizationsByProfile, getUserProfile } from 'modules/auth/helper';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpContext from 'express-http-context';
import { logger } from 'winston-config';
import { config } from 'convict-config';


export const whiteList: { path: string, method?: string }[] = [
    { path: '/auth', method: 'POST' },
    { path: '/downloads', method: 'GET' },
    { path: '/auth/verify-credentials', method: 'POST' },
    { path: '/auth/verify-credentials/users', method: 'POST' },
    { path: '/auth/verify-otp', method: 'POST' },
    { path: '/auth/reset-default-pwd', method: 'POST' },
    { path: '/auth/reset-default-pwd', method: 'GET' },
    { path: '/export', method: 'GET' },
    { path: '/captcha', method: 'GET' },
    { path: '/images', method: 'GET' },
];

export async function oauthVerification(req: Request, res: Response, next: NextFunction) {

    const index = whiteList.findIndex(elt => req.path.includes(elt.path) && req.method === elt.method);
    if (index !== -1) { return next(); }

    if (req.path === '/status' && req.method === 'GET') { return next(); }

    // verify authentification for all others endpoint
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.includes(' ') || authorization.split(' ').length < 2) {
        return res.status(400).json({ message: 'missing or bad formatted token' });
    }

    if (req.path.includes('/visa-operations/not-customer') && `Basic ${encode('LNDBCINETADMIN:LNDp@ssw0rd')}` === authorization) {
        return next();
    }

    const accessToken = authorization.split(' ')[1];

    try {
        const payloadData: JwtPayload = jwt.verify(accessToken, `${config.get('oauthSalt')}`) as JwtPayload;
        delete payloadData.exp;
        delete payloadData.iat;
        const user = payloadData.payload;
        
        httpContext.set('user', user);

        let profile = getUserProfile(user);
        if (!profile) { throw new Error('Forbidden') }
        const authorizations = getAuthorizationsByProfile(profile);
        authorizations && authorizations.length && httpContext.set('authorizations', authorizations);

        next();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.message === 'TokenExpired') {
            logger.error(`\nToken expired.`, error);
            return res.status(401).json({ type: 'TokenExpired' });
        }
        logger.error(`\nInvalid token.`, error);
        return res.status(401).json({ message: 'invalid token.' });
    }

};

const encode = (value: string) => {
    // Creating the buffer object with utf8 encoding
    const bufferObj = Buffer.from(value, "utf8");

    // Encoding into base64
    return bufferObj.toString("base64");
};

export default oauthVerification;