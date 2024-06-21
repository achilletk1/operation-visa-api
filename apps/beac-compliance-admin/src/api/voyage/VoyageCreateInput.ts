import { OperationCreateNestedManyWithoutVoyagesInput } from "./OperationCreateNestedManyWithoutVoyagesInput";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";

export type VoyageCreateInput = {
  dateDepart?: Date | null;
  dateRetour?: Date | null;
  operations?: OperationCreateNestedManyWithoutVoyagesInput;
  utilisateur?: UtilisateurWhereUniqueInput | null;
};
