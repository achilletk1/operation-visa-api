import { mkdirSync, writeFileSync, unlinkSync, readFileSync} from 'fs';
import { config } from '../config';
import { logger } from '../winston';
export const filesService = {

    writeFile:  (content: any, path: string, filename: string) => {
        try {
            const filePath = `${path}/${filename}`;
            mkdirSync(`${config.get('fileStoragePath')}/${path}`, { recursive: true });
            writeFileSync(`${config.get('fileStoragePath')}/${removeSpace(filePath)}`, content, 'base64');
            return filePath;
        } catch (error) {
            logger.error(`\n writeFile ${filename} error : ${error}`);
        }
    },

    readFile: (path: string) => {
        try {
            const contents = readFileSync(`${config.get('fileStoragePath')}/${removeSpace(path)}`, { encoding: 'base64' });
            return contents;
        } catch (error) {
            logger.error(`\n readFile ${path} error : ${error}`);
        }
    },

    readAnyFile: (path: string) => {
        try {
            const contents = readFileSync(path, { encoding: 'base64' });
            return contents;
        } catch (error) {
            logger.error(`\n readFile ${path} error : ${error}`);
        }
    },
    deleteFile:  (path: string) => {
        try {
            unlinkSync(`${config.get('fileStoragePath')}/${removeSpace(path)}`);
        } catch (error) {
            logger.error(`\n readFile ${path} error : ${error}`);
        }
    }
}

const removeSpace = (str) => {/*  */
    if (!str) { return; }
    return str.replace(/\s/g, '');
}

const removeSpecialCharacter = (str: any) => {
    if (!str) { return; }
    // str = replaceSpecialCharacters(str);
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
}