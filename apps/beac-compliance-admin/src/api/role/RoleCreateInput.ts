import { UtilisateurCreateNestedManyWithoutRolesInput } from "./UtilisateurCreateNestedManyWithoutRolesInput";

export type RoleCreateInput = {
  description?: string | null;
  nom?: string | null;
  utilisateurs?: UtilisateurCreateNestedManyWithoutRolesInput;
};
