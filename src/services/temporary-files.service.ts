import { filesService } from './files.service';
import { TemporaryFile } from '../models/settings';
import { temporaryFilesCollection } from '../collections/temporary-files.collection';
import { logger } from '../winston';
import moment = require('moment');


export const temporaryFilesService = {

    getTemporaryFileById: async (id: string) => {
        try {
            return await temporaryFilesCollection.getTemporaryFileById(id);
        } catch (error) {
            logger.error(`\nError getting visa temporary files \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTemporaryFileBy: async (data: any) => {
        try {
            return await temporaryFilesCollection.getTemporaryFilesBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateTemporaryFileById: async (id: string, data: any) => {
        try {
            const { fileName, content } = data;

            const temporaryFile = await temporaryFilesCollection.getTemporaryFileById(id);

            if (!temporaryFile) { return new Error('temporaryFileNotFound') }

            filesService.deleteFile(temporaryFile.path);

            const filePath = filesService.writeFile(content, `temporaryFiles/${id}`, fileName);

            temporaryFile.path = filePath;
            temporaryFile.fileName = fileName;
            temporaryFile.dates.updated = moment().valueOf();

            await temporaryFilesCollection.updateTemporaryFileById(id, temporaryFile);

            return temporaryFile;

        } catch (error) {
            logger.error(`\nError updating visa temporary files  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    deleteTemporaryFile: async (id: string) => {
        try {
            return await temporaryFilesCollection.deleteTemporaryFile(id);
        } catch (error) {
            logger.error(`\nError updating visa temporary files  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertTemporaryFile: async (data: any) => {
        try {
            const { fileName, content } = data;
            const temporaryFile: TemporaryFile = {
                dates: {
                    created: moment().valueOf()
                },
                expiresAt: moment().add(3, 'hours').valueOf(),
                fileName,
                path: ''
            }
            const { insertedId } = await temporaryFilesCollection.insertTemporaryFile(temporaryFile);

            const filePath = filesService.writeFile(content, `temporaryFiles/${insertedId}`, fileName);

            temporaryFile.path = filePath;
            temporaryFile.dates.updated = moment().valueOf();

            await temporaryFilesCollection.updateTemporaryFileById(insertedId, temporaryFile);

            const updatedData = await temporaryFilesCollection.getTemporaryFileById(insertedId.toString());
            
            return updatedData;
        } catch (error) {
            logger.error(`\nError inserting visa temporary files  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },




};
