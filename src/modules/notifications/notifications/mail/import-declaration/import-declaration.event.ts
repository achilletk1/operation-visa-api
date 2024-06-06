import { commonFields } from 'common/interfaces';
import { commonField } from 'common/base';
import { Import } from 'modules/imports';
import moment from "moment";

export class ImportDeclarationEvent extends commonField implements ImportDeclarationMailData {
    
    created_at!: string;

    constructor(importation: Import) {
        super(importation);
        this.created_at = `${moment(importation?.created_at).format('DD/MM/YYYY')}`;
    }
}

interface ImportDeclarationMailData extends commonFields {
    created_at: string;
}
