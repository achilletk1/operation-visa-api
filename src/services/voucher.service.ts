import { voucherCollection } from '../Collections/voucher.collections';
import { Voucher } from '../models/visa-operations';
import { logger } from '../winston';
import { commonService } from './common.service';


export const voucherService = {

    getVouchers: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await voucherCollection.getVouchers(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getVoucherById: async (id: string) => {
        try {
            return await voucherCollection.getVoucherById(id);
        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getVoucherBy: async (data: any) => {
        try {
            return await voucherCollection.getVoucherBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateVoucherById: async (id: string, data: any) => {
        try {
            const vourchers = await voucherCollection.getVoucherBy({});
            const foundIndex = vourchers.findIndex((e) => e.label === data.label && e._id.toString() !== id);
            if (foundIndex > -1) { return new Error('VourcherAlreadyExist') }
            return await voucherCollection.updateVoucherById(id, data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    deleteVoucher: async (id: string) => {
        try {
            return await voucherCollection.deleteVoucher(id);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertVoucher: async (data: Voucher) => {
        try {
            const vourchers = await voucherCollection.getVoucherBy({});
            const foundIndex = vourchers.findIndex((e) => e.label === data.label);
            if (foundIndex > -1) { return new Error('VourcherAlreadyExist') }
            return await voucherCollection.insertVoucher(data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

};
