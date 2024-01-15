import { TemporaryFilesRepository } from "./temporary-files.repository";
import { TemporaryFilesController } from './temporary-files.controller';
import { deleteDirectory, deleteFile, writeFile } from "common/utils";
import { CrudService } from "common/base";
import { TemporaryFile } from "./model";
import { ObjectId } from "mongodb";
import { isEmpty } from "lodash";
import moment from "moment";

export class TemporaryFilesService extends CrudService<TemporaryFile> {

    static temporaryFilesRepository: TemporaryFilesRepository;

    constructor() {
        TemporaryFilesService.temporaryFilesRepository = new TemporaryFilesRepository();
        super(TemporaryFilesService.temporaryFilesRepository);
    }

    async insertTemporaryFile(data: any) {
        try {
            const { fileName, content } = data;
            const temporaryFile: TemporaryFile = {
                dates: {
                    created: new Date().valueOf()
                },
                expiresAt: moment().add(3, 'hours').valueOf(),
                fileName,
                path: ''
            }
            const insertedId = await TemporaryFilesController.temporaryFilesService.create(temporaryFile);

            const filePath = writeFile(content, `temporaryFiles/${insertedId?.data}`, fileName);

            temporaryFile.path = filePath;
            temporaryFile.dates.updated = new Date().valueOf();

            await TemporaryFilesController.temporaryFilesService.update({ _id: insertedId?.data }, temporaryFile);

            const updatedData = await TemporaryFilesController.temporaryFilesService.findOne({ filter: { _id: insertedId?.data } });

            return updatedData;
        } catch (error) { throw error; }
    }

    async updateTemporaryFileById(id: string, data: any) {
        try {
            const { fileName, content } = data;

            const temporaryFile = await TemporaryFilesController.temporaryFilesService.findOne({ filter: { _id: id } });

            if (!temporaryFile) { return new Error('temporaryFileNotFound') }

            deleteFile(String(temporaryFile.path));

            const filePath = writeFile(content, `temporaryFiles/${id}`, fileName);

            temporaryFile.path = filePath;
            temporaryFile.fileName = fileName;
            temporaryFile.dates.updated = new Date().valueOf();

            await TemporaryFilesController.temporaryFilesService.update({ _id: id }, temporaryFile);

            return temporaryFile;

        } catch (error) { throw error; }
    }

    async deleteTemporaryFile(_id: string) {
        try {
            return await TemporaryFilesController.temporaryFilesService.deleteOne({ _id });
        } catch (error) { throw error; }
    }

    async removeTemporaryFiles() {
        try {
            const currentDate = new Date().valueOf();
            const temporaryFiles = await TemporaryFilesController.temporaryFilesService.findAll({ filter: { expiresAt: { $lt: currentDate } } });
            const ids = [];
            if (isEmpty(temporaryFiles)) { return; }
            for (const temporaryFile of temporaryFiles?.data) {
                ids.push(new ObjectId(temporaryFile?._id));
                deleteDirectory(`temporaryFiles/${temporaryFile?._id}`);
            }

            await TemporaryFilesController.temporaryFilesService.deleteMany({ _id: { $in: ids } });
        } catch (error) { throw error; }
    }

}