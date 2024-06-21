import { OperationCreateNestedManyWithoutCategoriesInput } from "./OperationCreateNestedManyWithoutCategoriesInput";
import { PieceJointeCreateNestedManyWithoutCategoriesInput } from "./PieceJointeCreateNestedManyWithoutCategoriesInput";

export type CategorieCreateInput = {
  description?: string | null;
  nom?: string | null;
  operations?: OperationCreateNestedManyWithoutCategoriesInput;
  pieceJointes?: PieceJointeCreateNestedManyWithoutCategoriesInput;
  piecesJointes?: string | null;
};
