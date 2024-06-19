import { settingsKeys } from 'modules/settings/model';
import { TokenPayload, OauthToken } from '../model';
import cache from 'common/services/cache.service';
import { config } from 'convict-config';
import  jwt from 'jsonwebtoken';

export function create(payload: TokenPayload): OauthToken {
    const issued = getCurrDateSeconds();
    const ttl = issued + (+(cache.get(settingsKeys.TTL_VALUE) as number) * 60);
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
    const ttl = issued + (+(cache.get(settingsKeys.TTL_VALUE) as number) * 60);
    const options = { expiresIn: `${ttl}` };

    return jwt.sign({ payload }, `${config.get('oauthSalt')}`, options);
};

const getCurrDateSeconds = (): number => {
    // tslint:disable-next-line: no-bitwise
    return new Date().valueOf() / 1000 | 0;
};
