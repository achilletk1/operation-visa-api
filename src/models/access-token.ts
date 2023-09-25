export interface TokenPayload {
        _id?: string;
        email?: string;
        userCode: string;
        fname?: string;
        lname?: string;
        tel?: string;
        category?: number;
        validationLevel?: number;
        companyId?: string;
        companyCategory?: number;
        issued?: number;
        ttl?: number;
}

export interface OauthToken {
    access_token: string;
    refresh_token: string;
    token_type: string;
    issued: number;
    expires_in: number;
}