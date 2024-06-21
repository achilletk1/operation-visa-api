import { StringFilter } from "../../util/StringFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { FloatNullableFilter } from "../../util/FloatNullableFilter";
import { OperationListRelationFilter } from "../operation/OperationListRelationFilter";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";

export type MoisPaiementEnLigneWhereInput = {
  id?: StringFilter;
  mois?: DateTimeNullableFilter;
  montantTotal?: FloatNullableFilter;
  operations?: OperationListRelationFilter;
  utilisateur?: UtilisateurWhereUniqueInput;
};
