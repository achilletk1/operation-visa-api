import { MoisPaiementEnLigneUpdateManyWithoutUtilisateursInput } from "./MoisPaiementEnLigneUpdateManyWithoutUtilisateursInput";
import { OperationUpdateManyWithoutUtilisateursInput } from "./OperationUpdateManyWithoutUtilisateursInput";
import { RoleWhereUniqueInput } from "../role/RoleWhereUniqueInput";
import { VoyageUpdateManyWithoutUtilisateursInput } from "./VoyageUpdateManyWithoutUtilisateursInput";

export type UtilisateurUpdateInput = {
  email?: string | null;
  moisPaiementEnLignes?: MoisPaiementEnLigneUpdateManyWithoutUtilisateursInput;
  motDePasse?: string | null;
  nom?: string | null;
  operations?: OperationUpdateManyWithoutUtilisateursInput;
  prenom?: string | null;
  role?: RoleWhereUniqueInput | null;
  voyages?: VoyageUpdateManyWithoutUtilisateursInput;
};
