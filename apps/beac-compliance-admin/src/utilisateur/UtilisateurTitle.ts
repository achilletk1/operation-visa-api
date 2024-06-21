import { Utilisateur as TUtilisateur } from "../api/utilisateur/Utilisateur";

export const UTILISATEUR_TITLE_FIELD = "motDePasse";

export const UtilisateurTitle = (record: TUtilisateur): string => {
  return record.motDePasse?.toString() || String(record.id);
};
