import { columnTitles, verifyTransactionFile, verifyTransactionFileContent, verifyTransactionFileDataContent, verifyTransactionFileName, verifyTransactionFileTypeContent, verifyTransactionNotEmptyFile } from "./helper";
import { VisaTransactionsFilesRepository } from "./visa-transactions-files.repository";
import { VisaTransactionsFilesController } from './visa-transactions-files.controller';
import { VisaOperationsController } from 'modules/visa-operations';
import { UsersController } from 'modules/users';
import { VisaTransactionsFile } from "./model";
import httpContext from 'express-http-context';
import { excelToJson } from "common/helpers";
import { CrudService } from "common/base";
import { FilesController } from "./files";
import { config } from "convict-config";
import { get } from "lodash";
import moment from "moment";

export class VisaTransactionsFilesService extends CrudService<VisaTransactionsFile> {

    static visaTransactionsFilesRepository: VisaTransactionsFilesRepository;

    constructor() {
        VisaTransactionsFilesService.visaTransactionsFilesRepository = new VisaTransactionsFilesRepository();
        super(VisaTransactionsFilesService.visaTransactionsFilesRepository);
    }

    async verifyTransactionFiles(data: any) {
        try {
            let found: VisaTransactionsFile | null = null;
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbbiden'); }

            const user = await UsersController.usersService.findOne({ filter: { _id: get(authUser, '_id') } });
            if (!user) { throw new Error('Forbbiden'); }

            let { content, email } = data;
            const { label } = data;
            content = Buffer.from(content).toString('base64');

            const fileName = label.replace('.xlsx' || '.xls', '');
            try { found = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { label } }); } catch(e) {}
            if (found) { throw new Error('FileAlreadyExist'); }
            const isNameCorrect = verifyTransactionFileName(fileName);
            if (!isNameCorrect) { throw new Error('IncorrectFileName'); }

            const dataArray = excelToJson(content);

            const fileIsNotEmpty = verifyTransactionNotEmptyFile(dataArray);
            if (!fileIsNotEmpty) { throw new Error('FileIsEmpty'); }
            const containsAll = verifyTransactionFile(dataArray);
            if (containsAll) {
                const error: any = new Error('IncorrectFileColumn');
                error['index'] = containsAll; throw error;
            }
            const monthsMatch = verifyTransactionFileContent(dataArray, fileName);
            if (monthsMatch > -1) {
                const error: any = new Error('IncorrectFileMonth');
                error['index'] = monthsMatch + 2; throw error;
            }
            const typesMatch = verifyTransactionFileTypeContent(dataArray);
            if (typesMatch) {
                const error: any = new Error('IncorrectFileType');
                [error['index'], error['type']] = [(typesMatch?.arrayIndex || 0) + 2, typesMatch.found.TYPE_TRANS];
                throw error;
            }
            const dataMatch = verifyTransactionFileDataContent(dataArray);
            if (dataMatch.line) {
                const error: any = new Error('IncorrectFileData');
                [error['index'], error['column'], error['type']] = [dataMatch.line, dataMatch.column, dataMatch.type];
                throw error;
            }
            if (!email) { email = get(user, 'email') };
            const transactionsFile = {
                label, content, email, status: 100,
                month: +fileName.split('_')[3],
                date: { created: moment().valueOf(), },
                userId: get(authUser, '_id').toString(),
                pending: moment().add(config.get('visaTransactionFilePendingValue'), 'minutes').valueOf(),
            };

            const insertedId = (await VisaTransactionsFilesController.visaTransactionsFilesService.create(transactionsFile))?.data;

            return { insertedId };
        } catch (error) { throw error; }
    }

    async confirmTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbbiden'); }
            let transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { userId, content, label } = transactionsFile;
            const fileName = label?.replace('.xlsx' || '.xls', '');
            if (userId !== get(authUser, '_id').toString()) { throw new Error('Forbbiden') }

            const visaTransactionsTmp = excelToJson(content);
            await VisaOperationsController.visaTransactionsTmpService.createMany(visaTransactionsTmp);

            const code = `${get(transactionsFile, '_id')?.toString()}-${fileName}`
            await FilesController.filesService.create({ key: code, value: content });

            transactionsFile = { ...transactionsFile, code };
            transactionsFile.status = 200;
            delete transactionsFile.content;
            delete transactionsFile.pending;


            await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: get(transactionsFile, '_id') }, transactionsFile);
            return await VisaTransactionsFilesController.visaTransactionsFilesService.updateDeleteFeild({ _id: get(transactionsFile, '_id') }, { pending: true, content: true });
        } catch (error) { throw error; }
    }

    async abortTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbbiden'); }

            return await VisaTransactionsFilesController.visaTransactionsFilesService.deleteOne({ _id: id });
        } catch (error) { throw error; }
    }

    async getTransactionFilesDataArray(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbbiden'); }

            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { content, label } = transactionsFile;

            let dataArray = excelToJson(content);
            dataArray = dataArray.slice(0, 40 || dataArray.length);
            return { dataArray, label };
        } catch (error) { throw error; }
    }

    getVisaTransationsFilesColumnTitles = () => columnTitles;

}