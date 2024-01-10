export interface CbsAccounts {
    NCP: string;
    INTI: string;
    AGE: string;
    DEV: string;
    CHA: string;
    CLC: string;
    CURRENCY: string;
    LIB_AGE: string;
}

export interface BaseCbsUser {
    NOMREST: string;
    NOM: string;
    PRE: string;
    NRC: string;
    NDIF: string;
    NID: string;
    VID: string;
    SEXT: string;
}

export interface CbsClientUser extends BaseCbsUser {
    AGE: string;
    LANG: string;
    CLI: string;
    LIBELLE_AGENCE: string;
    TEL: string;
    EMAIL: string;
    accounts: CbsAccounts[];
}

export interface CbsBankUser extends CbsClientUser {
    GES: string;
    CODE_GESTIONNAIRE: string;
    CODE_PROFIL: string;
    CODE_UTILISATEUR: string;
    NOMS_COMPLET: string;
    LIBELLE_PROFIL: string;
}

export interface CbsPhone {
    NUM: string;
    CLI: string;
    TYP: string;
    NOMREST: string;
}

export interface CbsEmail {
    EMAIL: string;
    CLI: string;
    TYP: string;
    NOMREST: string;
}

export interface cbsCard {
    AGE: string;
    CPRO: string;
    NUM_CPTE: string;
    CODE_CLIENT: string;
    DATE_FIN_VALIDITE: string;
    NOMREST: string;
    LIBELLE_TYPE: string;
    NUM_CARTE: string;
    INTITULE_CMPTE: string;
}

export interface cbsProduct {
    CPRO: string;
    LIB: string;
}
