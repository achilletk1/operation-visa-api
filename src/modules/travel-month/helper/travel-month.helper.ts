import { deleteDirectory, readFile, saveAttachment } from "common/utils";
import { Attachment } from "modules/visa-operations";

export function saveAttachmentTravelMonth(attachements: Attachment[], id: string, date: number) {
    for (let attachment of attachements) {
        if (!attachment.temporaryFile) { continue; }

        const content = readFile(String(attachment?.temporaryFile?.path));

        if (!content) { continue; }

        attachment.content = content;

        attachment = saveAttachment(id, attachment, date, 'travel');

        deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
        delete attachment.temporaryFile;
    }

    return attachements;
}
