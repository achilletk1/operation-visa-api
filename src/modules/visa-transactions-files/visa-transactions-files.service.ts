import { columnTitles, addUserDataInVisaTransactionFile, setLocalMethodPayment, allVerificationTransactionFile } from "./helper";
import { notificationEmmiter, ImportOperationErrorEvent } from "modules/notifications";
import { VisaTransactionsFilesRepository } from "./visa-transactions-files.repository";
import { VisaTransactionsFilesController } from './visa-transactions-files.controller';
import { VisaTransactionsTmp } from "modules/visa-operations/visa-transactions-tmp";
import { VisaOperationsController } from "modules/visa-operations";
import { renameSync, readdirSync, readFileSync } from 'fs';
import { excelToJson, isDev } from "common/helpers";
import { UsersController } from "modules/users";
import { VisaTransactionsFile } from "./model";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { FilesController } from "./files";
import { config } from "convict-config";
import { get } from "lodash";
import moment from "moment";
import path from 'path';


export class VisaTransactionsFilesService extends CrudService<VisaTransactionsFile> {

    static visaTransactionsFilesRepository: VisaTransactionsFilesRepository;

    constructor() {
        VisaTransactionsFilesService.visaTransactionsFilesRepository = new VisaTransactionsFilesRepository();
        super(VisaTransactionsFilesService.visaTransactionsFilesRepository);
    }

    async verifyTransactionFiles(data: any) {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { throw new Error('Forbidden'); }

            const user = await UsersController.usersService.findOne({ filter: { _id: get(authUser, '_id') } });
            if (!user) { throw new Error('Forbidden'); }

            let { content, email } = data;
            const { label } = data;
            content = Buffer.from(content).toString('base64');

            const visaTransactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.baseRepository.findOne({ filter: { label } }) as unknown as VisaTransactionsFile;

            const { fileName, dataArray } = await allVerificationTransactionFile(label, content, visaTransactionsFile);
            
            (!email) && (email = get(user, 'email'));
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

            const code = await this.addVisaTransactionsTmp(visaTransactionsTmp, fileName, content, get(transactionsFile, '_id'));

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
        try {
            // path directory
            const sourceFilePath = path.join(__dirname, config.get("importOperationPath"));
            const badDirPath = path.join(__dirname, config.get("importOperationFailPath"));
            const goodDirPath = path.join(__dirname, config.get("importOperationSuccessPath"));
            // init path name
            const root_import_operation_rec = isDev ? path.join(__dirname, config.get('importOperationPath')) : `${config.get('importOperationPath')}`;
            // recovery all file name in array of string[]
            const avis_directory_list = readdirSync(root_import_operation_rec, { encoding: 'utf8' }) || [];
            let index = 1;

            for (const label of avis_directory_list) {
                const indexOfDate = label?.toLowerCase()?.includes('terminaux') ? 6 : 4;
                const month = (label?.split('_') || [])[indexOfDate]?.slice(0, 6);
                try {
                    if (!label.includes('.xlsx') && !label.includes('.xls')) { throw new Error('BadFileFormat'); }
                    const filePath = path.join(sourceFilePath, label);
    
                    const fileContentBuffer = readFileSync(filePath, { flag: 'r' });
    
                    const content = fileContentBuffer.toString('base64');
    
                    const visaTransactionsFile = await VisaTransactionsFilesController.visaTransactionsFilesService.baseRepository.findOne({ filter: { label } }) as unknown as VisaTransactionsFile;
    
                    const { fileName, dataArray } = await allVerificationTransactionFile(label, content, visaTransactionsFile);

                    const transactionsFile = {
                        label, status: 200, month: +month, length: dataArray.length, email: '',
                        user: { _id: undefined, fullName: '', }, date: { created: new Date().valueOf(), },
                    };
                    const insertedId = (await VisaTransactionsFilesController.visaTransactionsFilesService.create(transactionsFile))?.data;

                    const code = await this.addVisaTransactionsTmp(dataArray, fileName, content, insertedId);
    
                    await VisaTransactionsFilesController.visaTransactionsFilesService.update({ _id: insertedId }, { code });
    
                    // move file in the success archive directory after saving
                    try { renameSync(path.join(sourceFilePath, label), path.join(goodDirPath, label)); }
                    catch (e: any) { this.logger.error(`error when try to moving ${path.join(sourceFilePath, label)} to ${path.join(goodDirPath, label)} \n${e.stack}`); }
                } catch (e: any) {
                    const msg = this.getErrorMessageForMail(e.message, label, index, month);
                    notificationEmmiter.emit('import-operation-error', new ImportOperationErrorEvent(msg));
    
                    // moving file in the fail directory and sending mail to notify admin
                    try { renameSync(path.join(sourceFilePath, label), path.join(badDirPath, label)); }
                    catch (e : any) { this.logger.error(`error when try to moving ${path.join(sourceFilePath, label)} to ${path.join(badDirPath, label)} \n${e.stack}`); }
                }
                index++;
            }
        } catch (e: any) {
            this.logger.error(`error during ImportOperationCron \n${e.stack}\n`); 
        }
    }

    getVisaTransactionsFilesColumnTitles = () => columnTitles;

    private getErrorMessageForMail = (msg: string, label: string = '', index: number = 1, month: string = ''): string => {
        let message = `Une erreur est survenue lors du traitement du fichier ${label} \n\nErreur: ${msg}`;

        (msg === 'FileAlreadyExist') && (message = `Un fichier portant le même nom ${label} a déjà été importé. \n
        Rassurez de ne pas importer le même fichier deux fois s'il vous plaît. \n
        S'il s'agit d'un fichier différent, veuillez le renommer afin qu'il respecte la nomenclature prédéfinie.  \n
        Nomenclature: BICEC_HORS_CEMAC_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
        Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202202.xlsx \n
        Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202203_01.xlsx \n
        Nomenclature: BICEC_INTERNET_SEUIL_1M_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
        Example: BICEC_INTERNET_SEUIL_1M_202203.xlsx \n
        Example: BICEC_INTERNET_SEUIL_1M_202203_02.xlsx`);

        (msg === 'IncorrectFileName') && (message = `Le fichier ${label} de la position ${index} de votre répertoire ne respecte pas la nommenclature de fichier. \n
        S'il s'agit d'un fichier différent, veuillez le renommer afin qu'il respecte la nomenclature prédéfinie. \n
        Nomenclature: BICEC_HORS_CEMAC_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
        Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202202.xlsx \n
        Example: BICEC_HORS_CEMAC_TERMINAUX_SEUIL_5M_202203_01.xlsx \n
        Nomenclature: BICEC_INTERNET_SEUIL_1M_[année en chiffres][mois en chiffres][texte supplémentaire].xlsx \n
        Example: BICEC_INTERNET_SEUIL_1M_202203.xlsx \n
        Example: BICEC_INTERNET_SEUIL_1M_202203_02.xlsx`);

        (msg === 'FileIsEmpty') && (message = `Le fichier ${label} de la position ${index} de votre répertoire est vide.`);

        (msg === 'IncorrectFileColumn') && (message = `Le fichier ${label} de la position ${index} de votre répertoire a des colonnes de fichier incorrect. \n
        Veuillez vous rassurer que les colonnes du fichier ${label} \n
        correspondent exactement à celles ci-dessous:</p> \n
        ${[...columnTitles].forEach(col => { { { col } } })}`);

        (msg === 'IncorrectFileMonth') && (message = `Le fichier ${label} de la position ${index} de votre répertoire a des colonnes de fichier incorrect. \n
        Les imports de fichiers se font uniquement par mois ! \n
        Veuillez vous assurez que toutes les opérations comprises dans ce fichier appartiennent au mois de \n ${month}`);

        (msg === 'IncorrectFileType') && (message = `Assurez-vous que les types de transactions inscrits dans le fichier à la colonne \n
        NATURE sont compris parmis les types ci-dessous : \n
        "ACHAT", "RETRAIT", "Rev Purchase", "Rev Withdrawal"`);

        (msg === 'IncorrectFileData') && (message = `Assurez-vous que les types de transactions inscrits dans le fichier à la colonne \n
        NATURE sont compris parmis les types ci-dessous : \n
        "ACHAT", "RETRAIT", "Rev Purchase", "Rev Withdrawal"`);

        (msg === 'IncorrectFileDuplicate') && (message = `Assurez-vous que les colonnes de votre fichier ${label} ne sont pas dupliquer`);

        (msg === 'BadFileFormat') && (message = `Le fichier "${label}" trouvé dans le repertoire dédié, n'est pas un fichier excel. Par conséquent il ne sera pas traiter, juste ignorer.`);

        return message;
    };

    private addVisaTransactionsTmp = async (dataArray: VisaTransactionsTmp[], fileName: string = '', content: string, insertedId: string = ''): Promise<string> => {
        try {
            await addUserDataInVisaTransactionFile(dataArray);
            await setLocalMethodPayment(fileName, dataArray);
            await VisaOperationsController.visaTransactionsTmpService.createMany(dataArray);

            const code = `${(insertedId || '')?.toString()}-${fileName}`
            await FilesController.filesService.create({ key: code, value: content });
            return code;
        } catch (error) { throw error; }
    };

}

