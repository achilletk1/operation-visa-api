import {
    HeadOfPersonnelAgencyPermissionRead, HeadOfPersonnelAgencyPermissionWrite,
} from "../../enum";
import { agencyHead } from ".";

const _headOfPersonnelAgency = {
    ...agencyHead,
    ...HeadOfPersonnelAgencyPermissionRead,
    ...HeadOfPersonnelAgencyPermissionWrite,
};

export const hadOfPersonnelAgency = _headOfPersonnelAgency;

export type HeadOfPersonnelAgencyAuth = keyof typeof _headOfPersonnelAgency;
