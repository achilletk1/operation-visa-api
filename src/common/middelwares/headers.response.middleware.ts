import { Request, Response, NextFunction, Express } from 'express';

export async function responseHeaders(req: Request, res: Response, next: NextFunction) {
    // res.setHeader( "Access-Control-Allow-Origin", "*" );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-type, x-access-token, authorization"
    );
    // res.setHeader( "Access-Control-Allow-Credentials", true );
    res.removeHeader("X-Powered-By");
    next();
};

export default responseHeaders;
