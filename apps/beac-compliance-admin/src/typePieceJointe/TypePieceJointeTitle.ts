import { TypePieceJointe as TTypePieceJointe } from "../api/typePieceJointe/TypePieceJointe";

export const TYPEPIECEJOINTE_TITLE_FIELD = "nom";

export const TypePieceJointeTitle = (record: TTypePieceJointe): string => {
  return record.nom?.toString() || String(record.id);
};
