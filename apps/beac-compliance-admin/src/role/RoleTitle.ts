import { Role as TRole } from "../api/role/Role";

export const ROLE_TITLE_FIELD = "nom";

export const RoleTitle = (record: TRole): string => {
  return record.nom?.toString() || String(record.id);
};
