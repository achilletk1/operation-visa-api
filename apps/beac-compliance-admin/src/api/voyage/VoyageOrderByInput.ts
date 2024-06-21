import { SortOrder } from "../../util/SortOrder";

export type VoyageOrderByInput = {
  createdAt?: SortOrder;
  dateDepart?: SortOrder;
  dateRetour?: SortOrder;
  id?: SortOrder;
  updatedAt?: SortOrder;
  utilisateurId?: SortOrder;
};
