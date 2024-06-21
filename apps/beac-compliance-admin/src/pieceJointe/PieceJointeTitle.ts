import { PieceJointe as TPieceJointe } from "../api/pieceJointe/PieceJointe";

export const PIECEJOINTE_TITLE_FIELD = "nomFichier";

export const PieceJointeTitle = (record: TPieceJointe): string => {
  return record.nomFichier?.toString() || String(record.id);
};
