import { CategorieWhereInput } from "./CategorieWhereInput";
import { CategorieOrderByInput } from "./CategorieOrderByInput";

export type CategorieFindManyArgs = {
  where?: CategorieWhereInput;
  orderBy?: Array<CategorieOrderByInput>;
  skip?: number;
  take?: number;
};
