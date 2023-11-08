import { TemporaryFile } from "modules/temporary-files";

export class Attachment {
    label?: string; // setting file name in backoffice
    fileName?: string; // name of the file at the upload
    name?: string; // internal name to identify the file in the server
    contentType?: string;
    content?: any;
    path?: string;
    voucherId?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    isRequired?: boolean;
    extension?: string;
    temporaryFile?: TemporaryFile;
}
