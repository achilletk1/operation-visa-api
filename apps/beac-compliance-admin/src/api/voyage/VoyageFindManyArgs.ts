import { VoyageWhereInput } from "./VoyageWhereInput";
import { VoyageOrderByInput } from "./VoyageOrderByInput";

export type VoyageFindManyArgs = {
  where?: VoyageWhereInput;
  orderBy?: Array<VoyageOrderByInput>;
  skip?: number;
  take?: number;
};
