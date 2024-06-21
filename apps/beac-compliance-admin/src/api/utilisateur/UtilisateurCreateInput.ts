import { MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput } from "./MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput";
import { OperationCreateNestedManyWithoutUtilisateursInput } from "./OperationCreateNestedManyWithoutUtilisateursInput";
import { RoleWhereUniqueInput } from "../role/RoleWhereUniqueInput";
import { VoyageCreateNestedManyWithoutUtilisateursInput } from "./VoyageCreateNestedManyWithoutUtilisateursInput";

export type UtilisateurCreateInput = {
  email?: string | null;
  moisPaiementEnLignes?: MoisPaiementEnLigneCreateNestedManyWithoutUtilisateursInput;
  motDePasse?: string | null;
  nom?: string | null;
  operations?: OperationCreateNestedManyWithoutUtilisateursInput;
  prenom?: string | null;
  role?: RoleWhereUniqueInput | null;
  voyages?: VoyageCreateNestedManyWithoutUtilisateursInput;
};
