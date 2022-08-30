
import { TokenPayload, OauthToken } from '../../../models/access-token';
import { config } from '../../../config';
import * as jwt from 'jsonwebtoken';
import { load } from 'protobufjs';
import * as moment from 'moment';

// Load Toke prototype
let AccessTokenMessage = null;

(async () => {
    const root = await load(`${__dirname}/schema.proto`);
    AccessTokenMessage = root.lookupType('AccessToken');
})();

/**
 * Get current date in seconds
 */
export const getCurrDateSeconds = (): number => {
    // tslint:disable-next-line: no-bitwise
    return moment().valueOf() / 1000 | 0;
}

export const create = (payload: TokenPayload): OauthToken => {
    const issued = getCurrDateSeconds();
    const ttl = issued + +config.get('oauthTTL');
    const options = { expiresIn: `${ttl}` }

    // tslint:disable-next-line: variable-name
    const access_token = jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);

    // tslint:disable-next-line: variable-name
    const refresh_token = jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);

    return { access_token, refresh_token, token_type: 'Bearer', issued, expires_in: ttl }
}

export const refresh = (token: string): any => {
    const payload: any = jwt.verify(token, `${config.get('oauthSalt')}`);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;

    const issued = getCurrDateSeconds();
    const ttl = issued + config.get('oauthTTL');
    const options = { expiresIn: `900000` };

    return jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);
}