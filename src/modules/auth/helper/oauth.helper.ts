import { TokenPayload, OauthToken } from '../model';
import { config } from 'convict-config';
import  jwt from 'jsonwebtoken';
import  moment from 'moment';

export function create(payload: TokenPayload): OauthToken {
    const issued = getCurrDateSeconds();
    const ttl = issued + +config.get('oauthTTL');
    const options = { expiresIn: `${ttl}` }

    // tslint:disable-next-line: variable-name
    const access_token = jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);

    // tslint:disable-next-line: variable-name
    const refresh_token = jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);

    return { access_token, refresh_token, token_type: 'Bearer', issued, expires_in: ttl }
}

export function refresh(token: string) {
    const payload: any = jwt.verify(token, `${config.get('oauthSalt')}`);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;

    const issued = getCurrDateSeconds();
    const ttl = issued + config.get('oauthTTL');
    const options = { expiresIn: `900000` };

    return jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);
};

const getCurrDateSeconds = (): number => {
    // tslint:disable-next-line: no-bitwise
    return moment().valueOf() / 1000 | 0;
};
