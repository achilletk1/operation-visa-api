import { columnTitles, verifyTransactionFile, verifyTransactionFileContent, verifyTransactionFileDataContent, verifyTransactionFileName, verifyTransactionFileTypeContent, verifyTransactionNotEmptyFile, verifyTransactionFileDuplicateData, fileCheckSumColumn, addUserDataInVisaTransactionFile, setLocalMethodPayment } from "./helper";
import { VisaOperationsController } from "modules/visa-operations/visa-operations.controller";
import { VisaTransactionsFilesRepository } from "./visa-transactions-files.repository";
import { VisaTransactionsFilesController } from './visa-transactions-files.controller';
import { VisaTransactionsTmp } from "modules/visa-operations/visa-transactions-tmp";
import { UsersController } from "modules/users/users.controller";
import { VisaTransactionsFile } from "./model";
import httpContext from 'express-http-context';
import { excelToJson } from "common/helpers";
import { CrudService } from "common/base";
import { FilesController } from "./files";
import { config } from "convict-config";
import * as util from 'util';
import { get } from "lodash";
import moment from "moment";
import * as fs from 'fs';
import path from 'path';
import { notificationEmmiter } from "modules/notifications";
import { ImportOperationErrorEvent } from "modules/notifications/notifications/mail/import-operation-error";


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
            if (!authUser) { throw new Error('Forbidden'); }

            const user = await UsersController.usersService.findOne({ filter: { _id: get(authUser, '_id') } });
            if (!user) { throw new Error('Forbidden'); }

            let { content, email } = data;
            const { label } = data;
            content = Buffer.from(content).toString('base64');

            const fileName = label?.replace('.xlsx' || '.xls', '');
            try { found = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { label } }); } catch (e) { }
            if (found) { throw new Error('FileAlreadyExist'); }
            const isNameCorrect = verifyTransactionFileName(fileName);
            if (!isNameCorrect) { throw new Error('IncorrectFileName'); }

            const dataArray = excelToJson(content) as VisaTransactionsTmp[];

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
            const typesMatch = verifyTransactionFileTypeContent(dataArray, label);
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
            const duplicatesindexes = await verifyTransactionFileDuplicateData(dataArray);
            if (!duplicatesindexes || duplicatesindexes.length > 0) {
                const error: any = new Error('IncorrectFileDuplicate');
                [error['index'], error['column']] = [duplicatesindexes, fileCheckSumColumn];
                throw error;
            }

            if (!email) { email = get(user, 'email') };
            const indexOfDate = fileName?.toLowerCase()?.includes('terminaux') ? 6 : 4;
            const transactionsFile = {
                label, content, email, status: 100,
                month: +fileName.split('_')[indexOfDate]?.slice(0, 6),
                length: dataArray.length,
                date: { created: new Date().valueOf(), },
                user: { _id: authUser?._id?.toString(), fullName: authUser?.fullName, },
                pending: moment().add(config.get('visaTransactionFilePendingValue'), 'minutes').valueOf(),
            };

            const insertedId = (await VisaTransactionsFilesController.visaTransactionsFilesService.create(transactionsFile))?.data;

            return { insertedId };
        } catch (error) { throw error; }
    }

    async confirmTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbidden'); }
            let transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });
            const { user, content, label } = transactionsFile;
            const fileName = label?.replace('.xlsx' || '.xls', '');
            if (user?._id?.toString() !== get(authUser, '_id').toString()) { throw new Error('Forbidden') }
            const visaTransactionsTmp = excelToJson(content) as VisaTransactionsTmp[];

            await addUserDataInVisaTransactionFile(visaTransactionsTmp);
            await setLocalMethodPayment(fileName, visaTransactionsTmp);
            await VisaOperationsController.visaTransactionsTmpService.createMany(visaTransactionsTmp);

            const code = `${get(transactionsFile, '_id')?.toString()}-${fileName}`
            await FilesController.filesService.create({ key: code, value: content });

            transactionsFile = { ...transactionsFile, code };
            transactionsFile.status = 200;
            delete transactionsFile.content;
            delete transactionsFile.pending;


            await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: get(transactionsFile, '_id') }, { ...transactionsFile }, { pending: true, content: true });
        } catch (error) { throw error; }
    }

    async abortTransactionFiles(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbidden'); }

            return await VisaTransactionsFilesController.visaTransactionsFilesService.deleteOne({ _id: id });
        } catch (error) { throw error; }
    }

    async getTransactionFilesDataArray(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbidden'); }

            const transactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { _id: id } });

            const { content, label } = transactionsFile;

            let dataArray = excelToJson(content);
            dataArray = dataArray.slice(0, 40 || dataArray.length);
            return { dataArray, label };
        } catch (error) { throw error; }
    }

    async importOperations() {
        let found: VisaTransactionsFile | null = null;
        let columnTitles = await VisaTransactionsFilesController.visaTransactionsFilesService.getVisaTransactionsFilesColumnTitles();
        let errorMessage;
        let month: string;
        // path directory
        const sourceFilePath = path.join(__dirname, config.get("importOperationPath"));
        const badDirPath = path.join(__dirname, config.get("importOperationFailPath"));
        const goodDirPath = path.join(__dirname, config.get("importOperationSuccessPath"));
        let fileName: any;
        let index = 0;
        const readDirPromise = util.promisify(fs.readdir);
        // init path name
        const root_import_operation_rec = config.get('env') === 'development' ?
            path.join(__dirname, config.get('importOperationPath'))
            : `${config.get('importOperationPath')}`;
        // recovery all file name in array of string[]
        const avis_directory_list = await readDirPromise(root_import_operation_rec, 'utf8');
        // verify if every file is excel type (xlsx or xls)
        const result = avis_directory_list.filter(label => !label.includes('.xlsx') || !label.includes('.xls'));
        if (result.length !== 0) {
            console.log("Veuillez vous rassurez que vos fichiers sont bien de type excel/");
            errorMessage = `Le fichier de la position ${index + 1} de votre répertoire n'est pas de type excel.`;
            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
            try {
                fs.renameSync(sourceFilePath, path.join(badDirPath, "Liste_de_fichier_non_excel"));
            } catch (error) {
                throw new Error('Fichier incorrect');
            }
        }
        if (avis_directory_list.length !== 0) {
            for (const label of avis_directory_list) {
                fileName = label?.replace('.xlsx' || '.xls', '');
                const indexOfDate = fileName?.toLowerCase()?.includes('terminaux') ? 6 : 4;
                const splitArray = fileName?.split('_') || [];
                month = splitArray[indexOfDate]?.split('.')[0]?.slice(0, 6);
                try { found = await VisaTransactionsFilesController.visaTransactionsFilesService.findOne({ filter: { label } }); } catch (e) { }
                if (found) {
                    console.log(`Le fichier à l'index ${index + 1} existe déja`);
                    errorMessage = `
                    Un fichier portant le même nom ${label} a déjà été importé. \n
                    Rassurez de ne pas importer le même fichier deux fois s'il vous plaît. \n
                    S'il s'agit d'un fichier différent, veuillez le renommer afin qu'il respecte la nomenclature prédéfinie.  \n
                    Nomenclature: BICEC_HORS_CEMAC_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
                    Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202202.xlsx \n
                    Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202203_01.xlsx \n
                    Nomenclature: BICEC_INTERNET_SEUIL_1M_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
                    Example: BICEC_INTERNET_SEUIL_1M_202203.xlsx \n
                    Example: BICEC_INTERNET_SEUIL_1M_202203_02.xlsx`;
                    notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
                    throw new Error('Fichier existant');
                }
                const isNameCorrect = verifyTransactionFileName(label);
                // moving file in the failrecovery when name file is incorrect and sending mail to notify admin
                if (!isNameCorrect) {
                    errorMessage = `Le fichier ${label} de la position ${index + 1} de votre répertoire ne respecte pas la nommenclature de fichier. \n
                    S'il s'agit d'un fichier différent, veuillez le renommer afin qu'il respecte la nomenclature prédéfinie. \n
                    Nomenclature: BICEC_HORS_CEMAC_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
                    Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202202.xlsx \n
                    Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202203_01.xlsx \n
                    Nomenclature: BICEC_INTERNET_SEUIL_1M_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
                    Example: BICEC_INTERNET_SEUIL_1M_202203.xlsx \n
                    Example: BICEC_INTERNET_SEUIL_1M_202203_02.xlsx`;
                    notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
                    try {
                        fs.renameSync(path.join(sourceFilePath, label), path.join(badDirPath, label));
                    } catch (error) {
                        continue;
                    }
                }
                const filePath = path.join(sourceFilePath, label);
                const method = async (err: any, data: any) => {
                    if (err) {
                        errorMessage = `Aucun fichier n'a été détecté dans votre répertoire,
                        veuillez vous rassurer que vos fichiers d'import sont bien répertorier.`;
                        notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
                        throw Error;
                    } else {
                        const datas = new Uint8Array(data);
                        const arr = new Array();
                        for (let i = 0; i !== datas.length; ++i) { arr[i] = +datas[i]; }
                        const bstr = arr;
                        const content = Buffer.from(bstr).toString('base64');
                        const dataArray = excelToJson(content) as VisaTransactionsTmp[];
                        const fileIsNotEmpty = verifyTransactionNotEmptyFile(dataArray);
                        if (!fileIsNotEmpty) {
                            console.log('FileIsEmpty');
                            errorMessage = `Le fichier ${label} de la position ${index + 1} de votre répertoire est vide.`
                            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
                            throw new Error('Fichier Vide');
                        }
                        const containsAll = verifyTransactionFile(dataArray);
                        if (containsAll) {
                            const error: any = new Error('IncorrectFileColumn');
                            errorMessage = `Le fichier ${label} de la position ${index + 1} de votre répertoire a des colonnes de fichier incorrect. \n
                            Veuillez vous rassurer que les colonnes du fichier ${label} \n
                            correspondent exactement à celles ci-dessous:</p> \n
                            ${columnTitles.forEach(col => {
                                { { col } }
                            })}`
                            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
                            error['index'] = containsAll; throw error;
                        }
                        const monthsMatch = verifyTransactionFileContent(dataArray, label);
                        if (monthsMatch > -1) {
                            const error: any = new Error('IncorrectFileMonth');
                            errorMessage = `Le fichier ${label} de la position ${index + 1} de votre répertoire a des colonnes de fichier incorrect. \n
                            Les imports de fichiers se font uniquement par mois ! \n
                            Veuillez vous assurez que toutes les opérations comprises dans ce fichier appartiennent au mois de \n
                            ${month}`
                            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage))
                            error['index'] = monthsMatch + 2; throw error;
                        }
                        const typesMatch = verifyTransactionFileTypeContent(dataArray, label);
                        if (typesMatch) {
                            const error: any = new Error('IncorrectFileType');
                            errorMessage = `Assurez-vous que les types de transactions inscrits dans le fichier à la colonne \n
                            NATURE sont compris parmis les types ci-dessous : \n
                            "ACHAT", "RETRAIT", "Rev Purchase", "Rev Withdrawal"`
                            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage));
                            [error['index'], error['type']] = [(typesMatch?.arrayIndex || 0) + 2, typesMatch.found.TYPE_TRANS];
                            throw error;
                        }
                        const dataMatch = verifyTransactionFileDataContent(dataArray);
                        if (dataMatch.line) {
                            const error: any = new Error('IncorrectFileData');
                            errorMessage = `Assurez-vous que les types de transactions inscrits dans le fichier à la colonne \n
                            NATURE sont compris parmis les types ci-dessous : \n
                            "ACHAT", "RETRAIT", "Rev Purchase", "Rev Withdrawal"`
                            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage));
                            [error['index'], error['column'], error['type']] = [dataMatch.line, dataMatch.column, dataMatch.type];
                            throw error;
                        }
                        const duplicatesindexes = await verifyTransactionFileDuplicateData(dataArray);
                        if (!duplicatesindexes || duplicatesindexes.length > 0) {
                            const error: any = new Error('IncorrectFileDuplicate');
                            errorMessage = `Assurez-vous que les colonnes de votre fichier ${label} ne sont pas dupliquer`;
                            notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(errorMessage));
                            [error['index'], error['column']] = [duplicatesindexes, fileCheckSumColumn];
                            throw error;
                        }
                        const transactionsFile = {
                            label, content, status: 100,
                            month: +month,
                            length: dataArray.length,
                            date: { created: new Date().valueOf(), },
                            pending: moment().add(config.get('visaTransactionFilePendingValue'), 'minutes').valueOf(),
                        };
                        await VisaTransactionsFilesController.visaTransactionsFilesService.create(transactionsFile);
                        // move file in the archive repertory after saving
                        try {
                            fs.renameSync(path.join(sourceFilePath, label), path.join(goodDirPath, label));
                        } catch (error) {
                            throw error;
                        }
                    }
                };
                fs.readFile(filePath, method);
                index++;
            }
        }
    }

    getVisaTransactionsFilesColumnTitles = () => columnTitles;


}

