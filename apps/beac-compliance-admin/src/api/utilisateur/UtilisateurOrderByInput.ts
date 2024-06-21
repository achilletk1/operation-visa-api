import { SortOrder } from "../../util/SortOrder";

export type UtilisateurOrderByInput = {
  createdAt?: SortOrder;
  email?: SortOrder;
  id?: SortOrder;
  motDePasse?: SortOrder;
  nom?: SortOrder;
  prenom?: SortOrder;
  roleId?: SortOrder;
  updatedAt?: SortOrder;
};
