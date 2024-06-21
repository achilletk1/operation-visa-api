import { SortOrder } from "../../util/SortOrder";

export type CategorieOrderByInput = {
  createdAt?: SortOrder;
  description?: SortOrder;
  id?: SortOrder;
  nom?: SortOrder;
  piecesJointes?: SortOrder;
  updatedAt?: SortOrder;
};
