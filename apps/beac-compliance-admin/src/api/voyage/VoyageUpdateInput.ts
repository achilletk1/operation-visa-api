import { OperationUpdateManyWithoutVoyagesInput } from "./OperationUpdateManyWithoutVoyagesInput";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";

export type VoyageUpdateInput = {
  dateDepart?: Date | null;
  dateRetour?: Date | null;
  operations?: OperationUpdateManyWithoutVoyagesInput;
  utilisateur?: UtilisateurWhereUniqueInput | null;
};
