import { agencyHead } from ".";
import { parameter } from "../admin";
import { support } from './../admin';

const _scrcDepartmentHead = {
    ...support,
    ...parameter,
    ...agencyHead,
};

export const scrcDepartmentHead = _scrcDepartmentHead;

export type ScrcDepartmentHeadAuth = keyof typeof _scrcDepartmentHead;
