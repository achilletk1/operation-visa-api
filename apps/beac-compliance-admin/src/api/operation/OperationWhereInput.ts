import { CategorieWhereUniqueInput } from "../categorie/CategorieWhereUniqueInput";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { MoisPaiementEnLigneWhereUniqueInput } from "../moisPaiementEnLigne/MoisPaiementEnLigneWhereUniqueInput";
import { FloatNullableFilter } from "../../util/FloatNullableFilter";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";
import { VoyageWhereUniqueInput } from "../voyage/VoyageWhereUniqueInput";

export type OperationWhereInput = {
  categorie?: CategorieWhereUniqueInput;
  date?: DateTimeNullableFilter;
  id?: StringFilter;
  moisPaiementEnLigne?: MoisPaiementEnLigneWhereUniqueInput;
  montant?: FloatNullableFilter;
  typeField?: "Option1";
  utilisateur?: UtilisateurWhereUniqueInput;
  voyage?: VoyageWhereUniqueInput;
};
