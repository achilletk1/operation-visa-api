import { getExtensionByContentType } from "modules/export";
import { Attachment } from "modules/visa-operation";
import { writeFile } from "./files.service";
import moment from "moment";

export function saveAttachment(ref: string, attachment: Attachment, created: number, operationType: string, subRepertory?: string) {
    try {
        const { content, label, contentType } = attachment;
        delete attachment.content
        const date = moment(created).format('DD-MM-YY');
        const year = moment(created).format('YYYY');
        let path = `${operationType}/${year}/${date}/${ref}`;
        if (subRepertory) { path = `${path}/${subRepertory}` }
        const extension = getExtensionByContentType(String(contentType));
        const filename = `${date}_${ref}_${label}${extension}`;
        writeFile(content, path, filename);
        attachment.path = `${path}/${filename}`;
        attachment.name = filename;
        delete attachment.content;
        return attachment;
    } catch (error) { throw error; }
};
