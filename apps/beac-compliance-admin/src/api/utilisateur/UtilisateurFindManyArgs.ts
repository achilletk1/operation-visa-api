import { UtilisateurWhereInput } from "./UtilisateurWhereInput";
import { UtilisateurOrderByInput } from "./UtilisateurOrderByInput";

export type UtilisateurFindManyArgs = {
  where?: UtilisateurWhereInput;
  orderBy?: Array<UtilisateurOrderByInput>;
  skip?: number;
  take?: number;
};
