declare module 'url-crypt' {
    const crypt: (salt: string) => URLCryptResult;
    
    type URLCryptResult = {
        cryptObj: (data: ObjectType) => string;
        decryptObj: (crytedData: string) => ObjectType;
    }

    type ObjectType = { [key: string]: any; }
    
    export default crypt;
}

declare module 'prompt-confirm';