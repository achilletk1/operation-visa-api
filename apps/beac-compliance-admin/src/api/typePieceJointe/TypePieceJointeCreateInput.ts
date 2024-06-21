import { PieceJointeCreateNestedManyWithoutTypePieceJointesInput } from "./PieceJointeCreateNestedManyWithoutTypePieceJointesInput";

export type TypePieceJointeCreateInput = {
  estObligatoire?: boolean | null;
  nom?: string | null;
  pieceJointes?: PieceJointeCreateNestedManyWithoutTypePieceJointesInput;
};
