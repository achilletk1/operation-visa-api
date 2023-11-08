export class TemporaryFile {
    _id?: any;
    dates!: {
        created?: number;
        updated?: number;
    }
    expiresAt?: number;
    path?: string;
    fileName?: string;

}
