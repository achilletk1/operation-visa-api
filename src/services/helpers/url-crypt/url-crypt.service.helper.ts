import { config } from '../../../config';
import { load } from 'protobufjs';
import  moment from 'moment';
import  crypto from 'crypto';
import  bs58 from 'bs58';

// Load URL prototype
let URLCryptMessage = null;

(async () => {
    const root = await load(`${__dirname}/url-crypt.proto`);
    URLCryptMessage = root.lookupType('URLCryptMessage');
})();

export const encode = (payload: any): string => {
    payload.ttl = moment().add(15, 'minutes').valueOf()
    const data = JSON.stringify(payload);
    payload = { data };
    URLCryptMessage.verify(payload);
    const message = URLCryptMessage.create(payload);
    const buffer = URLCryptMessage.encode(message).finish();
    const digest = crypto.createHmac('md5', config.get('oauthSalt')).update(buffer).digest();
    const token = bs58.encode(Buffer.concat([buffer, digest]));

    return token;
}

export const decode = (token: string): any => {
    let buffer = null;

    try {
        buffer = Buffer.from(bs58.decode(token));
    } catch (err) {
        throw new Error('MalformedToken');
    }

    const slicedBuffer = buffer.slice(0, buffer.length - 16);
    const digest = buffer.slice(buffer.length - 16, buffer.length);

    const hmac = crypto.createHmac('md5', config.get('oauthSalt')).update(slicedBuffer).digest();

    if (digest.compare(hmac) !== 0) { throw new Error('InvalidTokenSignature'); }

    const payload: any = URLCryptMessage.decode(slicedBuffer);
    const currTime = moment().valueOf();

    if (currTime >= payload.data.ttl) { throw new Error('TokenExpired'); }

    const data = JSON.parse(payload.data);
    delete data.ttl;
    return JSON.parse(payload.data);
}
