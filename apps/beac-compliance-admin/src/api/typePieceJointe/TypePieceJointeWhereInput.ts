import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { PieceJointeListRelationFilter } from "../pieceJointe/PieceJointeListRelationFilter";

export type TypePieceJointeWhereInput = {
  estObligatoire?: BooleanNullableFilter;
  id?: StringFilter;
  nom?: StringNullableFilter;
  pieceJointes?: PieceJointeListRelationFilter;
};
