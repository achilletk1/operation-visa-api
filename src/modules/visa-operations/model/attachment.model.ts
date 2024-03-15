import { TemporaryFile } from "modules/temporary-files";

// export class Attachment {
//     label?: string; // setting file name in backoffice
//     fileName?: string; // name of the file at the upload
//     name?: string; // internal name to identify the file in the server
//     contentType?: string;
//     content?: any;
//     path?: string;
//     voucherId?: string;
//     dates?: {
//         created?: number;
//         updated?: number;
//     };
//     isRequired?: boolean;
//     extension?: string;
//     temporaryFile?: TemporaryFile;
// }


export interface BaseAttachment {
    label?: string; // setting file name in backoffice
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
}

export interface VisaOperationsAttachment extends BaseAttachment {
    fileName?: string; // name of the file at the upload
    name?: string; // internal name to identify the file in the server
    temporaryFile?: TemporaryFile;
    label?: string; // title of the file at the upload
}