import { Utilisateur } from "../utilisateur/Utilisateur";

export type Role = {
  createdAt: Date;
  description: string | null;
  id: string;
  nom: string | null;
  updatedAt: Date;
  utilisateurs?: Array<Utilisateur>;
};
