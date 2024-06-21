import { Voyage as TVoyage } from "../api/voyage/Voyage";

export const VOYAGE_TITLE_FIELD = "id";

export const VoyageTitle = (record: TVoyage): string => {
  return record.id?.toString() || String(record.id);
};
