import { MoisPaiementEnLigne as TMoisPaiementEnLigne } from "../api/moisPaiementEnLigne/MoisPaiementEnLigne";

export const MOISPAIEMENTENLIGNE_TITLE_FIELD = "id";

export const MoisPaiementEnLigneTitle = (
  record: TMoisPaiementEnLigne
): string => {
  return record.id?.toString() || String(record.id);
};
