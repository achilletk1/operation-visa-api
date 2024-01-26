import { saveAttachment, deleteDirectory, readFile } from "common/utils";
import { VisaOperationsAttachment } from "modules/visa-operations";

export const saveAttachmentImportation = (attachments: VisaOperationsAttachment[] = [], id: string = '', date: number = new Date().valueOf()) => {
    for (let attachment of attachments) {
        if (!attachment.temporaryFile) { continue; }

        const content = readFile(String(attachment?.temporaryFile?.path));

        if (!content) { continue; }

        attachment.content = content;

        saveAttachment(id, attachment, date, 'importation');

        deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
        delete attachment.temporaryFile;
    }

    return attachments;
}
