import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { OperationListRelationFilter } from "../operation/OperationListRelationFilter";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";

export type VoyageWhereInput = {
  dateDepart?: DateTimeNullableFilter;
  dateRetour?: DateTimeNullableFilter;
  id?: StringFilter;
  operations?: OperationListRelationFilter;
  utilisateur?: UtilisateurWhereUniqueInput;
};
