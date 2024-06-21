import { Operation as TOperation } from "../api/operation/Operation";

export const OPERATION_TITLE_FIELD = "id";

export const OperationTitle = (record: TOperation): string => {
  return record.id?.toString() || String(record.id);
};
