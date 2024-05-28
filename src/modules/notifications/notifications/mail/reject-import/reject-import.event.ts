import { commonFields } from "common/interfaces";
import { commonField } from "common/base";
import { Import } from "modules/imports";

export class RejectImportEvent extends commonField implements RejectImportMailData {

    rejectReason!: string;

    constructor(importation: Import, public cc: string) {
        super(importation);
        this.rejectReason = (importation?.validators) && (importation?.validators[importation?.validators?.length - 1])?.rejectReason || '';
    }
}

interface RejectImportMailData extends commonFields {
    cc: string;
    rejectReason: string;
}