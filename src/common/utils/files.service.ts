import { mkdirSync, writeFileSync, unlinkSync, readFileSync, rmSync,existsSync } from 'fs';
import { config } from 'convict-config';

export function writeFile(content: any, path: string, filename: string, isUtf8?: boolean) {
    try {
        const filePath = `${path}/${filename}`;
        mkdirSync(`${config.get('fileStoragePath')}/${path}`, { recursive: true });
        writeFileSync(`${config.get('fileStoragePath')}/${removeSpace(filePath)}`, content, (!isUtf8) ? 'base64' : 'utf8');
        return filePath;
    } catch (error) { throw error; }
}

export function readFile(path: string, isUtf8?: boolean) {
    if(!existsSync(`${config.get('fileStoragePath')}/${removeSpace(path)}`))  return null
    try { return readFileSync(`${config.get('fileStoragePath')}/${removeSpace(path)}`, { encoding: (!isUtf8) ? 'base64' : 'utf8' }); }
    catch (error) { throw error; }
}


export function readAnyFile(path: string) {
    try { return readFileSync(path, { encoding: 'base64' }); }
    catch (error) { throw error; }
}

export function deleteFile(path: string) {
    try { unlinkSync(`${config.get('fileStoragePath')}/${removeSpace(path)}`); }
    catch (error) { throw error; }
}

export function deleteDirectory(path: string) {
    try { rmSync(`${config.get('fileStoragePath')}/${removeSpace(path)}`, { recursive: true, force: true }); }
    catch (error) { throw error; }
}

export function createDirectory(path: string) {
    try { mkdirSync(`${config.get('fileStoragePath')}/${path}`, { recursive: true }); }
    catch (error) { throw error; }
}

const removeSpace = (str: string) => {
    if (!str) { return; }
    return str.replace(/\s/g, '');
};
