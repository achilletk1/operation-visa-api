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
    TCLI: '1' | '2' | '3';  // 1 = PARTICULIER; 2 = SOCIETE; 3 = ENTREPRISE INDIVIDUELLE;
    CODE_PROFIL: string;
    LIBELLE_PROFIL: string;
}

export interface CbsClientUser extends BaseCbsUser {
    AGE: string;
    GES: string;
    LANG: string;
    CLI: string;
    LIBELLE_AGENCE: string;
    TEL: string;
    EMAIL: string;
    accounts: CbsAccounts[];
}

export interface CbsBankUser extends CbsClientUser {
    GES: string;
    GES_CODE: string;
    CODE_GESTIONNAIRE: string;
    CODE_UTILISATEUR: string;
    NOMS_COMPLET: string;
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

export interface CbsCard {
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

export interface CbsProduct {
    CPRO: string;
    LIB: string;
}

export interface CbsBankBranch {
    PAYS: string;
    LIB_PAYS: string;
    CODE_BANQUE: string;
    NOM_BANQUE: string;
    CODE_AGENCE: string;
    NOM_AGENCE: string;
}

export interface CbsBankAccountManager {
    AGE_UTI: string;
    FULLNAME: string;
    CODE_GES: string;
    AGE: string;
    EMAIL: string;
    TEL: string;
}
