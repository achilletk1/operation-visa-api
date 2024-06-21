import { Categorie } from "../categorie/Categorie";
import { MoisPaiementEnLigne } from "../moisPaiementEnLigne/MoisPaiementEnLigne";
import { Utilisateur } from "../utilisateur/Utilisateur";
import { Voyage } from "../voyage/Voyage";

export type Operation = {
  categorie?: Categorie | null;
  createdAt: Date;
  date: Date | null;
  id: string;
  moisPaiementEnLigne?: MoisPaiementEnLigne | null;
  montant: number | null;
  typeField?: "Option1" | null;
  updatedAt: Date;
  utilisateur?: Utilisateur | null;
  voyage?: Voyage | null;
};
