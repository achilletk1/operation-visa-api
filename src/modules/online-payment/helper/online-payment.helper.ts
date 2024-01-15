import { deleteDirectory, readFile, saveAttachment } from "common/utils";
import { VisaOperationsAttachment } from "modules/visa-operations";

export function saveAttachmentOnlinePayment(attachments: VisaOperationsAttachment[] = [], id: string, date: number = new Date().valueOf()) {
    for (let attachment of attachments) {
        if (!attachment?.temporaryFile) { continue; }

        const content = readFile(String(attachment?.temporaryFile?.path));

        if (!content) { continue; }

        attachment.content = content;

        attachment = saveAttachment(id, attachment, date, 'onlinePayment');

        deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
        delete attachment?.temporaryFile;
    }

    return attachments;
}
