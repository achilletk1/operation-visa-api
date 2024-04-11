import {
    HeadOfRegionPermissionRead, HeadOfRegionPermissionWrite,
} from "../../enum";
import { agencyHead } from ".";

const _headOfRegionRead = {
    ...agencyHead,
    ...HeadOfRegionPermissionRead,
    ...HeadOfRegionPermissionWrite,
};

export const headOfRegion = _headOfRegionRead;

export type HeadOfRegionAuth = keyof typeof _headOfRegionRead;
