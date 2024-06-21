import { Operation } from "../operation/Operation";
import { Utilisateur } from "../utilisateur/Utilisateur";

export type MoisPaiementEnLigne = {
  createdAt: Date;
  id: string;
  mois: Date | null;
  montantTotal: number | null;
  operations?: Array<Operation>;
  updatedAt: Date;
  utilisateur?: Utilisateur | null;
};
