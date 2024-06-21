import { Categorie as TCategorie } from "../api/categorie/Categorie";

export const CATEGORIE_TITLE_FIELD = "nom";

export const CategorieTitle = (record: TCategorie): string => {
  return record.nom?.toString() || String(record.id);
};
