import { getExtensionByContentType } from "modules/export";
import { writeFile } from "./files.service";
import moment from "moment";
import { VisaOperationsAttachment } from "modules/visa-operations";

export function saveAttachment(ref: string, attachment: VisaOperationsAttachment, created: number | undefined = new Date().valueOf(), operationType: string, subRepertory?: string) {
    try {
        const { content, label, contentType } = attachment;
        delete attachment.content
        const date = moment(created).format('DD-MM-YY');
        const year = moment(created).format('YYYY');
        let path = `${operationType}/${year}/${date}/${ref}`;
        if (subRepertory) { path = `${path}/${subRepertory}` }
        const extension = getExtensionByContentType(String(contentType));
        const filename = `${date}_${ref}_${label}${extension}`.replace(/[\\/]/g, '_');
        writeFile(content, path, filename);
        attachment.path = `${path}/${filename}`;
        attachment.name = filename;
        delete attachment.content;
        return attachment;
    } catch (error) { throw error; }
};
