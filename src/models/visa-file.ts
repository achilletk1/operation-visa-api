export interface Visafile {
  _id?: string;
  label?: string;
  code?: string; // clé d'enregistrement dans files collection
  month?: number; // Année et mois des operations du fichier exple: 202202
  date?: { created?: number, updated?: number };
  pending?: number;
  content?: any;
  userId?: string;
  email?: string;
  status?: VisaFileStatus;
}

export enum VisaFileStatus {
  VERIFIER = 100,
  TRAITER = 200,
  ECHEC = 300,
  EN_COURS = 400
}
