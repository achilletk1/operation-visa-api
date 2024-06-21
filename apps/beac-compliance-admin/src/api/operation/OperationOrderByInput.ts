import { SortOrder } from "../../util/SortOrder";

export type OperationOrderByInput = {
  categorieId?: SortOrder;
  createdAt?: SortOrder;
  date?: SortOrder;
  id?: SortOrder;
  moisPaiementEnLigneId?: SortOrder;
  montant?: SortOrder;
  typeField?: SortOrder;
  updatedAt?: SortOrder;
  utilisateurId?: SortOrder;
  voyageId?: SortOrder;
};
