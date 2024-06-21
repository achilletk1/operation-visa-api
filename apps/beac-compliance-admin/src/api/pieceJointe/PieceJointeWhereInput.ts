import { CategorieWhereUniqueInput } from "../categorie/CategorieWhereUniqueInput";
import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { TypePieceJointeWhereUniqueInput } from "../typePieceJointe/TypePieceJointeWhereUniqueInput";

export type PieceJointeWhereInput = {
  categorie?: CategorieWhereUniqueInput;
  id?: StringFilter;
  nomFichier?: StringNullableFilter;
  typePieceJointe?: TypePieceJointeWhereUniqueInput;
  url?: StringNullableFilter;
};
