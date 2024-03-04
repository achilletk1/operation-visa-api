import { VisaRecapOperationsController } from '../visa-recap-operation-statement.controller';
import { StatementReport } from '../model';
import { StatementType } from '../enum';
import { Travel } from 'modules/travel';
import AdmZip from 'adm-zip';
import moment from 'moment';
import XLSX from 'xlsx';
import { deleteDirectory, readFile, writeFile } from 'common/utils';
import { config } from 'convict-config';
import { readFileSync } from 'fs';
import path from 'path';

export async function getBEACReportZipOnBase64Format(transactions: any[] = [], subDirectory: 'tmp_transaction' | 'tmp_exceeded'): Promise<string> {
    try {
        const arrayOfArrayData = generateArrayOfArrayData(transactions);
        return await generateZipReportOnBase64Format(arrayOfArrayData, subDirectory);
    } catch (error) { throw error; }
}

export function getBEACReportExcelFormat(transactions: any[] = []) {
    try {
        const arrayOfArrayData = generateArrayOfArrayData(transactions);
        return generateRecapOpeXls(arrayOfArrayData);
    } catch (error) { throw error; }
}

async function generateZipReportOnBase64Format(arrayOfArrayData: string[][] = [], directoryAndFileName: string): Promise<string> {
    let data = '';
    for (let i = 0; i < arrayOfArrayData.length; i++) { data += (arrayOfArrayData[i].join(',') + ';'); }
    const zip = new AdmZip();
    zip.addFile(`${directoryAndFileName}.txt`, Buffer.from(data, 'utf8'));
    return zip.toBuffer().toString('base64');
    const zipData: any = {
        fileContent: zip.toBuffer().toString('base64'),
        contentType: 'application/zip, application/octet-stream',
        name: directoryAndFileName + '.zip',
    };
    // const filePath = writeFile(data, directoryAndFileName, `${directoryAndFileName}.txt`, true);
    // zip.addLocalFile(path.join(config.get('fileStoragePath'), filePath));
    // zip.writeZip(path.join(config.get('fileStoragePath'), directoryAndFileName, `${directoryAndFileName}.zip`));
    // const base64Data = await zipFileToBase64(path.join(config.get('fileStoragePath'), directoryAndFileName, `${directoryAndFileName}.zip`));
    // deleteDirectory(directoryAndFileName);
    // return base64Data;
}

export async function insertStatementReport(type: StatementType, base64Data: string) {
    const month = (type === StatementType.MONTHLY) 
        ? getSubMonth()
        : `${getSubMonth()} / ${getSubMonth(2)} / ${getSubMonth(3)}`;
    const statementReport: StatementReport = { type, base64Data, month, send_at: undefined };
    return await VisaRecapOperationsController.visaRecapOperationsService.create(statementReport);
}

const getSubMonth = (num: number = 1) => moment().subtract(num, 'months').format('YYYY-MM').valueOf();

export function generateRecapOpeXls(arrayOfArrayData: string[][]) {
    const excelFile = generateVisaTransactionExportXlsx(arrayOfArrayData);
    const buffer = Buffer.from(excelFile);
    return [{ name: `recapitulatif_des_operations_${moment().format('DD-MM-YY')}`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', content: buffer }];
}

export function generateVisaTransactionExportXlsx(arrayOfArrayData: string[][]) {
    const ws = XLSX.utils.aoa_to_sheet(arrayOfArrayData);
    const wb = XLSX.utils.book_new();
    // Set Excel file columns width;
    ws['!cols'] = [];
    arrayOfArrayData[0].forEach(() => ws['!cols']?.push({ wch: 23 }));

    XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().getTime()}`);
    return XLSX.write(wb, { type: 'array', bookSST: true, compression: true });
};

export function generateArrayOfArrayData(transactions: any[] | Travel[]): string[][] {
    const title = [
        'Date', `Titulaire de l'instrument électronique`, 'Montant', 'Dévise', 'Contrevaleur en XAF',
        'Motif', 'Date départ', 'Lieu', 'Bénéficiaire'
    ];
    const arrayData = transactions.map((transaction: any | Travel) => {
        return [
            `${moment((transaction?.dates) ? transaction?.dates : transaction?.dates?.created).format('DD/MM/YYYY')} `,
            `${transaction?.fullName || transaction?.user?.fullName || 'N/A'}`,
            `${transaction?.amount || 0}`,
            `${transaction?.proofTravel?.countries[0]?.currencies?.code || 'N/A'}`,
            `${transaction?.amount || 'N/A'}`,
            `${transaction?.travelReason?.label || 'N/A'}`,
            `${transaction?.amount || 'N/A'}`,
            `${transaction?.country || transaction?.proofTravel?.countries[0]?.name || ''}`,
            `${transaction?.beneficiary || transaction?.transactions[0]?.beneficiary || ''}`,
        ];
    });
    arrayData.unshift(title);
    return arrayData;
}

export async function base64ToTxtFile(base64Data: string): Promise<string> {
    try {
        if (!base64Data) { throw new Error('NotDataFound'); };
        const zipBuffer = Buffer.from(base64Data, 'base64');
        const zip = new AdmZip(zipBuffer);
        return (zip.getEntries() || [])[0]?.getData()?.toString('utf8');
        // const zipEntries = zip.getEntries();
        // const entry = zipEntries[0];
        // const txtContent = entry.getData().toString('utf8');
        // const path = writeFile(txtContent, 'tmp_export', 'tmp_export.txt', true);
        // const fileContent = readFile(path, true);
        // deleteDirectory('tmp_export');
        // return fileContent
    } catch (error) { throw error; }
}

export const txtToArray = (data: string = '') => data?.toString()?.split(';')?.map(e => e?.split(','));

// async function zipFileToBase64(filePath: string): Promise<string> {
//     try {
//         const data = readFileSync(filePath);
//         const zip = new AdmZip(data);
//         const zipBuffer = zip.toBuffer();
//         const base64Data = zipBuffer.toString('base64');
//         return base64Data;
//     } catch (err) {
//         throw err;
//     }
// }
