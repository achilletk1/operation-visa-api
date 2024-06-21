import { Operation } from "../operation/Operation";
import { Utilisateur } from "../utilisateur/Utilisateur";

export type Voyage = {
  createdAt: Date;
  dateDepart: Date | null;
  dateRetour: Date | null;
  id: string;
  operations?: Array<Operation>;
  updatedAt: Date;
  utilisateur?: Utilisateur | null;
};
