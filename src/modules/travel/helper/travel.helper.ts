import { deleteDirectory, getTotal, readFile, saveAttachment } from "common/utils";
import { Attachment, OpeVisaStatus } from "modules/visa-operations";
import { Travel } from "../model";

export const saveAttachmentTravel = (attachements: Attachment[], id: string, date: number) => {
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

export function getTravelStatus(travel: Travel): OpeVisaStatus {

    if (!travel) { throw new Error('TravelNotDefined'); }
    const amount = getTotal(travel?.transactions || []);
    let status = travel?.ceiling && +travel?.ceiling < amount ? [travel?.proofTravel?.status, travel?.expenseDetailsStatus] : [travel?.proofTravel?.status];

    if (status.every(elt => elt === OpeVisaStatus.EMPTY)) { return OpeVisaStatus.EMPTY; }

    if (status.every(elt => elt === OpeVisaStatus.JUSTIFY)) { return OpeVisaStatus.JUSTIFY; }

    if (status.every(elt => elt === OpeVisaStatus.CLOSED)) { return OpeVisaStatus.CLOSED; }

    if (status.includes(OpeVisaStatus.EXCEDEED)) { return OpeVisaStatus.EXCEDEED; }

    if (status.includes(OpeVisaStatus.REJECTED) && !status.includes(OpeVisaStatus.EXCEDEED)) { return OpeVisaStatus.REJECTED; }

    if (status.includes(OpeVisaStatus.TO_VALIDATED) &&
        !status.includes(OpeVisaStatus.REJECTED) &&
        !status.includes(OpeVisaStatus.EXCEDEED) &&
        !status.includes(OpeVisaStatus.TO_COMPLETED) &&
        !status.includes(OpeVisaStatus.EMPTY)
    ) {
        return OpeVisaStatus.TO_VALIDATED;
    }

    if (status.includes(OpeVisaStatus.TO_COMPLETED) &&
        !status.includes(OpeVisaStatus.REJECTED) &&
        !status.includes(OpeVisaStatus.EXCEDEED)) {
        return OpeVisaStatus.TO_COMPLETED;
    }
    return OpeVisaStatus.TO_COMPLETED;
}
