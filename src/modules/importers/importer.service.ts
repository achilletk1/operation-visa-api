
import { ImporterController } from './importer.controller';
import { ImporterRepository } from './importer.repository';
import { CrudService } from "common/base";

export class ImporterService extends CrudService<any> {

    static importerRepository: ImporterRepository;

    constructor() {
        ImporterService.importerRepository = new ImporterRepository();
        super(ImporterService.importerRepository);
    }

    async insertImporter(importer: any): Promise<any> {
        try {
            const infoCard = this.getCbsDataImporter(importer);
            const insertedId = await ImporterController.importerService.create(infoCard);
            return insertedId;

        } catch (error) { throw error; }
    }

    async updateImporterById(id: string, data: any) {
        try {
            // const authUser = httpContext.get('user');
            // const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            return await ImporterController.importerService.update({ _id: id }, data);
        } catch (error) { throw error; }
    }

    async getImporters(filters: any) {
        // const filters = this.extractPaginationData(fields)
        try {
            return await ImporterController.importerService.findAll(filters);
        } catch (error) { throw error; }
    }

    private getCbsDataImporter(importer: any) {
        return {
            cardHoldername: 'MVOGO LEBADA',
            ncp: "37107035891",
            age: "02000",
            typeCard: 'VISA'
        }
    }
    

}
