import { CategorieWhereUniqueInput } from "../categorie/CategorieWhereUniqueInput";
import { TypePieceJointeWhereUniqueInput } from "../typePieceJointe/TypePieceJointeWhereUniqueInput";

export type PieceJointeCreateInput = {
  categorie?: CategorieWhereUniqueInput | null;
  nomFichier?: string | null;
  typePieceJointe?: TypePieceJointeWhereUniqueInput | null;
  url?: string | null;
};
