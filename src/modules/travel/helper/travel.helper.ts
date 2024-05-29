import { VisaOperationsAttachment, OpeVisaStatus as OVS, Validator } from "modules/visa-operations";
import { deleteDirectory, getTotal, readFile, saveAttachment } from "common/utils";
import { TravelMonth } from 'modules/travel-month';
import { Editor } from "modules/users";
import { Travel } from "../model";
import { isEmpty } from "lodash";

export const saveAttachmentTravel = (attachments: VisaOperationsAttachment[] = [], id: string, date: number = new Date().valueOf()) => {
    for (let attachment of attachments) {
        if (!attachment.temporaryFile) { continue; }

        const content = readFile(String(attachment?.temporaryFile?.path));

        if (!content) { continue; }

        attachment.content = content;

        attachment = saveAttachment(id, attachment, date, 'travel');

        deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
        delete attachment.temporaryFile;
    }

    return attachments;
}

export function getTravelStatus(travel: Travel | TravelMonth, ceilingTravelMonth?: number): OVS {

    if (!travel) { throw new Error('TravelNotDefined'); }
    const amount = getTotal(travel?.transactions || []);
    const ceiling = ceilingTravelMonth || (travel as Travel)?.ceiling
    let status = ceiling && +ceiling < amount ? [((travel as Travel)?.proofTravel?.status || []), travel?.expenseDetailsStatus] : [((travel as Travel)?.proofTravel?.status || [])];

    if (status.every(elt => elt === OVS.EMPTY)) { return OVS.EMPTY; }

    if (status.every(elt => elt === OVS.JUSTIFY)) { return OVS.JUSTIFY; }

    if (status.every(elt => elt === OVS.VALIDATION_CHAIN)) { return OVS.VALIDATION_CHAIN; }

    if (status.every(elt => elt === OVS.CLOSED)) { return OVS.CLOSED; }

    // if (status.includes(OpeVisaStatus.EXCEDEED)) { return OpeVisaStatus.EXCEDEED; }

    if (status.includes(OVS.REJECTED)/* && !status.includes(OpeVisaStatus.EXCEEDED)*/) { return OVS.REJECTED; }

    if (status.includes(OVS.TO_VALIDATED) &&
        /*!status.includes(OpeVisaStatus.EXCEEDED) &&*/
        !status.includes(OVS.TO_COMPLETED) &&
        !status.includes(OVS.EMPTY)
    ) {
        return OVS.TO_VALIDATED;
    }

    if (status.includes(OVS.TO_COMPLETED)/* && !status.includes(OpeVisaStatus.EXCEEDED)*/) {
        return OVS.TO_COMPLETED;
    }
    return OVS.TO_COMPLETED;
}

export function getProofTravelStatus(travel: Travel, maxValidationLevelRequired: number): OVS {

    if (!travel || !travel?.proofTravel) { throw new Error('TravelNotDefined'); }

    const { isPassOut, isPassIn, isTransportTicket, isVisa, proofTravelAttachs, validators } = { ...travel?.proofTravel } || {};

    const labels = ['Ticket de transport', 'Tampon de sortie du passeport', 'Tampon d\'entrée du passeport'];

    if (!isPassOut && !isPassIn && !isTransportTicket && !isVisa) { return OVS.EMPTY; }

    if (!proofTravelAttachs || proofTravelAttachs.filter(e => labels.includes(e.label || '')).length !== 3) { return OVS.TO_COMPLETED; }

    if (!validators || isEmpty(validators) || checkIsUpdateAfterRejection(validators, travel?.editors)) { return OVS.TO_VALIDATED; }

    if (validators[validators?.length - 1]?.status === 300) { return OVS.REJECTED; }

    if (validators?.length !== +maxValidationLevelRequired) { return OVS.VALIDATION_CHAIN; }

    if (travel?.status !== OVS.CLOSED) { return OVS.JUSTIFY; }

    return OVS.CLOSED;
}

const checkIsUpdateAfterRejection = (validators: Validator[] = [], editors: Editor[] = []) => {
    const lastValidator = validators[validators?.length - 1];
    return !isEmpty(validators) && // check if it have min one validation
        lastValidator?.status === 300 && // check if last validators have reject step
        editors.filter(e => e?.date >= +(lastValidator?.date || 0) && e?.steps?.includes('Preuve de voyage'))?.length > 0;
};
