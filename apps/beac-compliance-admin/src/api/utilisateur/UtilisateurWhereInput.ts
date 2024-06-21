import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { MoisPaiementEnLigneListRelationFilter } from "../moisPaiementEnLigne/MoisPaiementEnLigneListRelationFilter";
import { OperationListRelationFilter } from "../operation/OperationListRelationFilter";
import { RoleWhereUniqueInput } from "../role/RoleWhereUniqueInput";
import { VoyageListRelationFilter } from "../voyage/VoyageListRelationFilter";

export type UtilisateurWhereInput = {
  email?: StringNullableFilter;
  id?: StringFilter;
  moisPaiementEnLignes?: MoisPaiementEnLigneListRelationFilter;
  motDePasse?: StringNullableFilter;
  nom?: StringNullableFilter;
  operations?: OperationListRelationFilter;
  prenom?: StringNullableFilter;
  role?: RoleWhereUniqueInput;
  voyages?: VoyageListRelationFilter;
};
