import { OperationUpdateManyWithoutCategoriesInput } from "./OperationUpdateManyWithoutCategoriesInput";
import { PieceJointeUpdateManyWithoutCategoriesInput } from "./PieceJointeUpdateManyWithoutCategoriesInput";

export type CategorieUpdateInput = {
  description?: string | null;
  nom?: string | null;
  operations?: OperationUpdateManyWithoutCategoriesInput;
  pieceJointes?: PieceJointeUpdateManyWithoutCategoriesInput;
  piecesJointes?: string | null;
};
