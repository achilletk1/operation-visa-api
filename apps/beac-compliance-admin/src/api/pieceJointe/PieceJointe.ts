import { Categorie } from "../categorie/Categorie";
import { TypePieceJointe } from "../typePieceJointe/TypePieceJointe";

export type PieceJointe = {
  categorie?: Categorie | null;
  createdAt: Date;
  id: string;
  nomFichier: string | null;
  typePieceJointe?: TypePieceJointe | null;
  updatedAt: Date;
  url: string | null;
};
