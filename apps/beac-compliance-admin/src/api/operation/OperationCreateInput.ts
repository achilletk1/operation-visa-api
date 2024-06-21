import { CategorieWhereUniqueInput } from "../categorie/CategorieWhereUniqueInput";
import { MoisPaiementEnLigneWhereUniqueInput } from "../moisPaiementEnLigne/MoisPaiementEnLigneWhereUniqueInput";
import { UtilisateurWhereUniqueInput } from "../utilisateur/UtilisateurWhereUniqueInput";
import { VoyageWhereUniqueInput } from "../voyage/VoyageWhereUniqueInput";

export type OperationCreateInput = {
  categorie?: CategorieWhereUniqueInput | null;
  date?: Date | null;
  moisPaiementEnLigne?: MoisPaiementEnLigneWhereUniqueInput | null;
  montant?: number | null;
  typeField?: "Option1" | null;
  utilisateur?: UtilisateurWhereUniqueInput | null;
  voyage?: VoyageWhereUniqueInput | null;
};
