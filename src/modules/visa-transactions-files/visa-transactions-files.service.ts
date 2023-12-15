import { VisaTransactionsCeilingsController } from 'modules/visa-transactions-ceilings';
import { VisaTransactionsFilesRepository } from "./visa-transactions-files.repository";
import { VisaTransactionsFilesController } from './visa-transactions-files.controller';
import { OperationType } from 'modules/visa-operations';
import { UsersController } from 'modules/users';
import httpContext from 'express-http-context';
import { excelToJson } from "common/helpers";
import { CrudService } from "common/base";
import { config } from "convict-config";
import { get } from "lodash";
import moment from "moment";
import {
    calculateOverruns, extractTransactionsFromContent, insertNotCustomersCorporates, verifyTransactionFile,
    verifyTransactionFileContent, verifyTransactionFileName, verifyTransactionFileTypeContent,
    verifyTransactionNotEmptyFile
} from "./helper";

export class VisaTransactionsFilesService extends CrudService<any> {

    static visaTransactionsFilesRepository: VisaTransactionsFilesRepository;

    constructor() {
        VisaTransactionsFilesService.visaTransactionsFilesRepository = new VisaTransactionsFilesRepository();
        super(VisaTransactionsFilesService.visaTransactionsFilesRepository);
    }

    async verifyTransactionFiles(data: any) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw Error('Forbbiden'); }

            const user = await UsersController.usersService.findOne({ filter: { _id: get(authUser, '_id') } });
            if (!user) { throw Error('Forbbiden'); }

            let { content, email } = data;
            const { label } = data;
            content = Buffer.from(content).toString('base64');

            const fileName = label.replace('.xlsx' || '.xls', '');
            const found = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { label } });
            if (found) { throw Error('FileAlreadyExist'); }
            const isNameCorrect = verifyTransactionFileName(fileName);
            if (!isNameCorrect) { throw Error('IncorrectFileName'); }

            const dataArray = excelToJson(content);

            const fileIsNotEmpty = verifyTransactionNotEmptyFile(dataArray);
            if (!fileIsNotEmpty) { throw Error('FileIsEmpty'); }
            const containsAll = verifyTransactionFile(Object.keys(dataArray[0] as any));
            if (containsAll) {
                const error: any = new Error('IncorrectFileColumn');
                error['index'] = containsAll; return error;
            }
            const monthsMatch = verifyTransactionFileContent(dataArray, fileName);
            if (monthsMatch > -1) {
                const error: any = new Error('IncorrectFileMonth');
                error['index'] = monthsMatch + 2; return error;
            }
            const typesMatch = verifyTransactionFileTypeContent(dataArray);
            if (typesMatch) {
                const error: any = new Error('IncorrectFileType');
                [error['index'], error['type']] = [(typesMatch?.arrayIndex || 0) + 2, typesMatch.found.NATURE];
                return error;
            }
            if (!email) { email = get(user, 'email') };
            const transactionsFile = {
                label, content, email, status: 100,
                month: +fileName.split('_')[3],
                date: { created: moment().valueOf(), },
                userId: get(authUser, '_id').toString(),
                pending: moment().add(config.get('visaTransactionFilePendingValue'), 'minutes').valueOf(),
            };

            const insertedId = await VisaTransactionsFilesController.visaTransactionsFilesService.create(transactionsFile);

            return { insertedId };
        } catch (error) { throw error; }
    }

    async confirmTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw Error('Forbbiden'); }
            let transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { userId, content, label } = transactionsFile;
            const fileName = label.replace('.xlsx' || '.xls', '');
            if (userId !== get(authUser, '_id').toString()) { throw Error('Forbbiden') }

            delete transactionsFile.pending;
            transactionsFile.status = 400;
            const code = `${get(transactionsFile, '_id').toString()}-${fileName}`
            transactionsFile = { ...transactionsFile, code };
            // await filesCollection.saveFile({ key: code, value: content });
            await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: get(transactionsFile, '_id') }, transactionsFile);
            return await VisaTransactionsFilesController.visaTransactionsFilesService.updateDeleteFeild({ _id: get(transactionsFile, '_id') }, { pending: true });
        } catch (error) { throw error; }
    }

    async startTraitment(id: string) {
        try {
            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { content, month } = transactionsFile;

            const transactions = extractTransactionsFromContent(content, month);
            let accounts = transactions.map((element: any) => {
                return `${element.age}-${element.ncp}-${element.clientCode}`
            });

            accounts = accounts.filter((item: any, pos: any, self: any) => self.indexOf(item) === pos);
            const otherAccounts = [];
            const ceillings = (await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findAll({ filter: { _id: id } }))?.data;
            const ceilling = { onp: 0, tpew: 0 };
            ceilling.onp = ceillings.find((e: any) => e.type === OperationType.ONLINE_PAYMENT)?.value;
            ceilling.tpew = ceillings.find((e: any) => e.type === OperationType.ELECTRONIC_PAYMENT_TERMINAL)?.value; // TPE
            for (const account of accounts) {
                const user = await UsersController.usersService.findOne({ filter: { clientCode: account.split('-')[2] } });
                if (!user) {
                    otherAccounts.push(account);
                    continue;
                }
                await calculateOverruns(account, transactions, month, ceilling, user);

            }
            if (otherAccounts.length > 0) {
                let index = 0;
                const corporateAccounts = [];
                let otherClientCodes = otherAccounts.map(e => e.split('-')[2]);
                otherClientCodes = otherClientCodes.filter((item, pos, self) => self.indexOf(item) === pos);
                do {
                    const filteredClientCodes = otherClientCodes.slice(index, index + 100)
                    const data = /*await cbsService.checkIfIsRetailClients(filteredClientCodes) */ [] as any[];
                    corporateAccounts.push(...data);
                    index = index + 100
                } while (index < otherAccounts.length);
                await insertNotCustomersCorporates(corporateAccounts, transactions, month, ceilling);
            }
            transactionsFile.status = 200;
            delete transactionsFile.content;
            await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: get(transactionsFile, '_id') }, transactionsFile);
            return await VisaTransactionsFilesController.visaTransactionsFilesService.updateDeleteFeild({ _id: get(transactionsFile, '_id') }, { content: true });
        } catch (error) { throw error; }
    }

    async restartConfirmTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw Error('Forbbiden'); }

            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });
            const { userId } = transactionsFile;

            if (userId !== get(authUser, '_id').toString()) { throw Error('Forbbiden') }

            await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: get(transactionsFile, '_id') }, { status: 400 });
            return await VisaTransactionsFilesController.visaTransactionsFilesService.updateDeleteFeild({ _id: get(transactionsFile, '_id') }, { pending: true });
        } catch (error) { throw error; }
    }

    async restartTraitment(id: string) {
        try {
            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { content, month } = transactionsFile;
            await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.deleteMany({ currentMonth: month });
            const transactions = extractTransactionsFromContent(content, month);
            let accounts = transactions.map((element) => {
                return `${element.age}-${element.ncp}-${element.clientCode}`
            });

            accounts = accounts.filter((item, pos, self) => self.indexOf(item) === pos);
            const otherAccounts = [];
            const ceillings = (await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findAll({ filter: { _id: id } }))?.data;
            const ceilling = { onp: 0, tpew: 0 };
            ceilling.onp = ceillings.find(e => e.type === OperationType.ONLINE_PAYMENT).value;
            ceilling.tpew = ceillings.find(e => e.type === OperationType.ELECTRONIC_PAYMENT_TERMINAL).value; // TPE
            for (const account of accounts) {
                const user = await UsersController.usersService.findOne({ filter: { clientCode: account.split('-')[2] } });
                if (!user) {
                    otherAccounts.push(account);
                    continue;
                }
                await calculateOverruns(account, transactions, month, ceilling, user);

            }
            if (otherAccounts.length > 0) {
                let index = 0;
                const corporateAccounts = [];
                let otherClientCodes = otherAccounts.map(e => e.split('-')[2]);
                otherClientCodes = otherClientCodes.filter((item, pos, self) => self.indexOf(item) === pos);
                do {
                    const filteredClientCodes = otherClientCodes.slice(index, index + 100)
                    const data = /*await cbsService.checkIfIsRetailClients(filteredClientCodes)*/ [] as any[];
                    corporateAccounts.push(...data);
                    index = index + 100
                } while (index < otherAccounts.length);
                await insertNotCustomersCorporates(corporateAccounts, transactions, month, ceilling);
            }
            transactionsFile.status = 200;
            delete transactionsFile.content;
            await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: get(transactionsFile, '_id') }, transactionsFile);
            return await VisaTransactionsFilesController.visaTransactionsFilesService.updateDeleteFeild({ _id: get(transactionsFile, '_id') }, { content: true });
        } catch (error) { throw error; }
    }
    
    async sendPostTransactionFileThreadError(id: string) {
        try {
            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });
            const authUser = httpContext.get('user');
            if (!authUser) {
                return new Error('Forbbiden');
            }
            const { email, label } = transactionsFile;
            const response = await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: id }, { status: 300 });
            // await notificationService.sendPostTransactionFileThreadError({ fullName: `${get(authUser, 'fname')} ${get(authUser, 'lname')}`, label }, email);
            return response;
        } catch (error) { throw error; }
    }

    async abortTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw Error('Forbbiden'); }

            return await VisaTransactionsFilesController.visaTransactionsFilesService.deleteOne({ _id: id });
        } catch (error) { throw error; }
    }

    async getTransactionFilesDataArray(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw Error('Forbbiden'); }

            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { content } = transactionsFile;

            let dataArray = excelToJson(content);
            dataArray = dataArray.slice(0, 40 || dataArray.length);
            return { dataArray };
        } catch (error) { throw error; }
    }

}