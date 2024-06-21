import { PieceJointe } from "../pieceJointe/PieceJointe";

export type TypePieceJointe = {
  createdAt: Date;
  estObligatoire: boolean | null;
  id: string;
  nom: string | null;
  pieceJointes?: Array<PieceJointe>;
  updatedAt: Date;
};
