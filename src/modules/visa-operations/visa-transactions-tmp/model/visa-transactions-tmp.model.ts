import { VisaTransaction } from "modules/visa-transactions";

export interface VisaTransactionsTmpAggregate {
    _id: string;
    travel: VisaTransaction[];
    onlinepayment: VisaTransaction[];
}

export interface VisaTransactionsTmp {
    AGENCE: string;
    COMPTE: string;
    CHAPITRE: string;
    CLIENT: string;
    NOM_CLIENT: string;
    CODE_GESTIONNAIRE: string;
    NOM_GESTIONNAIRE: string;
    TELEPHONE_CLIENT: string;
    EMAIL_CLIENT: string;
    NOM_CARTE: string;
    CARTE: string;
    PRODUIT: string;
    DATE: string;
    HEURE: string;
    MONTANT: string;
    DEVISE: string;
    MONTANT_COMPENS: string;
    DEVISE_COMPENS: string;
    MONTANT_XAF: string;
    TYPE_TRANS: string;
    CATEGORIE: string;
    PAYS: string;
    ACQUEREUR: string;
}
