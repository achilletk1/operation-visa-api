import { UtilisateurUpdateManyWithoutRolesInput } from "./UtilisateurUpdateManyWithoutRolesInput";

export type RoleUpdateInput = {
  description?: string | null;
  nom?: string | null;
  utilisateurs?: UtilisateurUpdateManyWithoutRolesInput;
};
