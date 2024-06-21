import { PieceJointeWhereInput } from "./PieceJointeWhereInput";
import { PieceJointeOrderByInput } from "./PieceJointeOrderByInput";

export type PieceJointeFindManyArgs = {
  where?: PieceJointeWhereInput;
  orderBy?: Array<PieceJointeOrderByInput>;
  skip?: number;
  take?: number;
};
