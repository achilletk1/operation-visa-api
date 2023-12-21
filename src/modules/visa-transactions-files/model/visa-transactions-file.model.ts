import { User } from "modules/users";

export interface VisaTransactionsFile {
    _id?: string;
    label?: string;
    code?: string; // clé d'enregistrement dans redis
    month?: string; // Année et mois des operations du fichier exple: 202202
    date?: { created: number, updated: number };
    pending?: number;
    content?: any;
    user?: Partial<User>;
    email?: string;
    status?: VisaTransactionsFileStatus;
}

export enum VisaTransactionsFileStatus {
    VERIFIER = 100,
    TRAITER = 200,
    ECHEC = 300,
    EN_COURS = 400
}
