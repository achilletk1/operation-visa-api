import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { UtilisateurListRelationFilter } from "../utilisateur/UtilisateurListRelationFilter";

export type RoleWhereInput = {
  description?: StringNullableFilter;
  id?: StringFilter;
  nom?: StringNullableFilter;
  utilisateurs?: UtilisateurListRelationFilter;
};
