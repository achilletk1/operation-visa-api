import { deleteDirectory, getTotal, readFile, saveAttachment } from "common/utils";
import { Attachment, OpeVisaStatus, Validator } from "modules/visa-operations";
import { Editor } from "modules/users";
import { Travel } from "../model";
import { isEmpty } from "lodash";
import moment from "moment";

export const saveAttachmentTravel = (attachements: Attachment[] = [], id: string, date: number = moment().valueOf()) => {
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

    if (status.every(elt => elt === OpeVisaStatus.VALIDATION_CHAIN)) { return OpeVisaStatus.VALIDATION_CHAIN; }

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

export function getProofTravelStatus(travel: Travel, maxValidationLevelRequired: number): OpeVisaStatus {

    if (!travel || !travel?.proofTravel) { throw new Error('TravelNotDefined'); }

    const { isPassOut, isPassIn, isTransportTicket, isVisa, proofTravelAttachs, validators } = { ...travel?.proofTravel } || {};

    const labels = ['Ticket de transport', 'Tampon de sortie du passeport', 'Tampon d\'entrée du passeport'];

    if (!isPassOut && !isPassIn && !isTransportTicket && !isVisa) { return OpeVisaStatus.EMPTY; }

    if (!proofTravelAttachs || proofTravelAttachs.filter(e => labels.includes(e.label || '')).length !== 3) { return OpeVisaStatus.TO_COMPLETED; }

    if (!validators || isEmpty(validators) || checkIsUpdateAfterRejection(validators, travel?.editors)) { return OpeVisaStatus.TO_VALIDATED; }

    if (validators[validators?.length - 1]?.status === 300) { return OpeVisaStatus.REJECTED; }

    if (validators?.length !== +maxValidationLevelRequired) { return OpeVisaStatus.VALIDATION_CHAIN; }

    if (travel?.status !== OpeVisaStatus.CLOSED) { return OpeVisaStatus.JUSTIFY; }

    return OpeVisaStatus.CLOSED;
}

const checkIsUpdateAfterRejection = (validators: Validator[] = [], editors: Editor[] = []) => {
    const lastValidator = validators[validators?.length - 1];
    return !isEmpty(validators) && // check if it have min one validation
    lastValidator?.status === 300 && // check if last validators have reject step
    editors.filter(e => e?.date >= +(lastValidator?.date || 0) && e?.steps?.includes('Preuve de voyage'))?.length > 0;
};
