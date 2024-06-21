import { OperationCreateNestedManyWithoutMoisPaiementEnLignesInput } from "./OperationCreateNestedManyWithoutMoisPaiementEnLignesInput";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";

export type MoisPaiementEnLigneCreateInput = {
  mois?: Date | null;
  montantTotal?: number | null;
  operations?: OperationCreateNestedManyWithoutMoisPaiementEnLignesInput;
  utilisateur?: UtilisateurWhereUniqueInput | null;
};
