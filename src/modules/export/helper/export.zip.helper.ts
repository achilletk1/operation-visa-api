import type { OnlinePaymentMonth, OnlinePaymentStatement } from "modules/online-payment";
import { createDirectory, deleteDirectory, readFile, writeFile } from "common/utils";
import type { ExpenseDetail, OthersAttachement, Travel } from "modules/travel";
import { getExtensionByContentType } from "./export.pdf.helper";
import type { Attachment } from 'modules/visa-operations';
import { getRandomString } from "common/helpers";
import { config } from "convict-config";
import AdmZip from 'adm-zip';
import path from 'path';


export const getFileNamesTree = (data: Travel | OnlinePaymentMonth, type: 'travel' | 'onlinePayment'): any[] => {

    const tree = [];

    if (type === 'travel') {
        const travel = data as Travel;
        tree.push({
            label: 'Preuve De Voyage', type: 'folder',
            files: travel?.proofTravel?.proofTravelAttachs?.filter((elt: Attachment) => !!elt?.path)?.map((elt: Attachment) => {
                return { path: elt?.path, label: elt?.label, type: 'file', contentType: elt?.contentType };
            })
        });
        tree.push({
            label: 'Dépenses', type: 'folder',
            files: travel?.expenseDetails?.map((elt: ExpenseDetail, index: number) => {
                return {
                    label: elt?.ref || index, type: 'folder',
                    files: elt?.attachments?.filter((elt: Attachment) => !!elt?.path)?.map((att: Attachment, index: number) => {
                        return { path: att?.path, label: `fichier_justif_${elt?.ref}_${index}`, type: 'file', contentType: att?.contentType };
                    })
                };
            })
        });
        tree.push({
            label: 'Atres Justificatifs', type: 'folder',
            files: travel?.othersAttachements?.map((elt: OthersAttachement, index: number) => {
                return {
                    label: elt?.ref || index, type: 'folder',
                    files: elt?.attachments?.filter((elt: Attachment) => !!elt?.path)?.map((att: any) => {
                        return { path: att?.path, label: `fichier_justif_${elt?.ref}_${index}`, type: 'file', contentType: att?.contentType };
                    })
                };
            })
        });
    }

    if (type === 'onlinePayment') {
        const onlinePayment = data as OnlinePaymentMonth;
        tree.push({
            label: 'Dépenses', type: 'folder',
            files: onlinePayment?.statements?.map((elt: OnlinePaymentStatement, index: number) => {
                return {
                    label: elt?.statementRef || index, type: 'folder',
                    files: elt?.attachments?.filter((elt: Attachment) => !!elt?.path)?.map((att: Attachment) => {
                        return { path: att?.path, label: `fichier_justif_${elt?.statementRef}_${index}`, type: 'file', contentType: att?.contentType };
                    })
                };
            })
        });
    }

    return tree;
};


export const generateOperationZippedFolder = (folder: Folder[]): Buffer => {
    const basePath = path.join('/tmp', getRandomString(5));
    folder.forEach((element) => {
        generateFileOrFolder(element, basePath);
    });
    const zip = new AdmZip();
    zip.addLocalFolder(path.join(config.get('fileStoragePath'), basePath));
    deleteDirectory(basePath);
    return zip.toBuffer();
};

export const generateFileOrFolder = (element: File | Folder, currentPath: string): void => {
    if (element?.type === 'file') {
        const content = element?.content || readFile(element?.path!) as unknown as Buffer;
        writeFile(content, currentPath, `${element?.label}${getExtensionByContentType(element?.contentType || '')}`);
    }
    if (element?.type === 'folder') {
        createDirectory(path.join(currentPath, element?.label));
        element?.files?.forEach((fileOrFolder: any) => {
            generateFileOrFolder(fileOrFolder, path.join(currentPath, element?.label));
        });
    }
};

interface File {
    type: 'file';
    label: string;
    content?: Buffer;
    contentType?: string;
    path?: string;
};

interface Folder {
    type: 'folder';
    label: string;
    files: (File | Folder)[];
};
