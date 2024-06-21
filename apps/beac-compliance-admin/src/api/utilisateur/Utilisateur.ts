import { MoisPaiementEnLigne } from "../moisPaiementEnLigne/MoisPaiementEnLigne";
import { Operation } from "../operation/Operation";
import { Role } from "../role/Role";
import { Voyage } from "../voyage/Voyage";

export type Utilisateur = {
  createdAt: Date;
  email: string | null;
  id: string;
  moisPaiementEnLignes?: Array<MoisPaiementEnLigne>;
  motDePasse: string | null;
  nom: string | null;
  operations?: Array<Operation>;
  prenom: string | null;
  role?: Role | null;
  updatedAt: Date;
  voyages?: Array<Voyage>;
};
