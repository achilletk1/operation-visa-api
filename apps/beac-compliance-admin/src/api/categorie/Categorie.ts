import { Operation } from "../operation/Operation";
import { PieceJointe } from "../pieceJointe/PieceJointe";

export type Categorie = {
  createdAt: Date;
  description: string | null;
  id: string;
  nom: string | null;
  operations?: Array<Operation>;
  pieceJointes?: Array<PieceJointe>;
  piecesJointes: string | null;
  updatedAt: Date;
};
