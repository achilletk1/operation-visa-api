import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { OperationListRelationFilter } from "../operation/OperationListRelationFilter";
import { PieceJointeListRelationFilter } from "../pieceJointe/PieceJointeListRelationFilter";

export type CategorieWhereInput = {
  description?: StringNullableFilter;
  id?: StringFilter;
  nom?: StringNullableFilter;
  operations?: OperationListRelationFilter;
  pieceJointes?: PieceJointeListRelationFilter;
  piecesJointes?: StringNullableFilter;
};
