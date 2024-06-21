import { OperationUpdateManyWithoutMoisPaiementEnLignesInput } from "./OperationUpdateManyWithoutMoisPaiementEnLignesInput";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";

export type MoisPaiementEnLigneUpdateInput = {
  mois?: Date | null;
  montantTotal?: number | null;
  operations?: OperationUpdateManyWithoutMoisPaiementEnLignesInput;
  utilisateur?: UtilisateurWhereUniqueInput | null;
};
