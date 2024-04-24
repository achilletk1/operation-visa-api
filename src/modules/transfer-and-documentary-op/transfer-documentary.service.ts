import { convertParams, extractPaginationData, getAgenciesQuery } from "common/helpers";
import { TransferDocumentaryController } from "./transfer-documentary.controller";
import { TransferDocumentaryRepository } from "./transfer-documentary.repository";
import { CrudService, QueryFilter, QueryOptions } from "common/base";
import { saveAttachmentTravel } from "modules/travel/helper";
import { OpeVisaStatus } from "modules/visa-operations";
import { Operation } from "./model";
import moment from "moment";

export class TransferDocumentaryService extends CrudService<Operation> {

    static transferDocumentaryRepository: TransferDocumentaryRepository;

    constructor() {
        TransferDocumentaryService.transferDocumentaryRepository = new TransferDocumentaryRepository();
        super(TransferDocumentaryService.transferDocumentaryRepository);
    }


    async getOperations(query: QueryOptions) {
        try {
            query.filter = this.formatFilters(query.filter || {});
            return await TransferDocumentaryController.transferDocumentaryService.findAll(query);
        } catch (error) { throw error; }
    }

    async getOperationsAgencies(query: QueryOptions) {
        try {
            query = convertParams(query || {});
            query = extractPaginationData(query || {});
            if (query?.filter?.start && query?.filter?.end) {
                delete query?.filter?.start; delete query?.filter?.end;
                query = {
                    ...query, start: moment(query?.filter?.start, 'DD-MM-YYYY').startOf('day').valueOf(),
                    end: moment(query?.filter?.end, 'DD-MM-YYYY').endOf('day').valueOf()
                } as QueryOptions;
            }

            const data = await TransferDocumentaryController.transferDocumentaryService.findAllAggregate<Operation>(getAgenciesQuery(query));
            delete query?.offset; delete query?.limit;
            const total = (await TransferDocumentaryController.transferDocumentaryService.findAllAggregate<Operation>(getAgenciesQuery(query))).length;
            return { data, total };
        } catch (error) { throw error; }
    }


    async insertOperation(operation: Operation): Promise<any> {
        try {
            operation.status = OpeVisaStatus.TO_COMPLETED;

            operation.dates = { ...operation.dates, created: new Date().valueOf() };

            const insertedId = await TransferDocumentaryController.transferDocumentaryService.create(operation);

            operation.proofOperationAttachs = saveAttachmentTravel(operation?.proofOperationAttachs, insertedId?.data, operation.dates.created);

            await TransferDocumentaryController.transferDocumentaryService.update({ _id: insertedId?.data }, { proofOperationAttachs: operation.proofOperationAttachs });

            return insertedId;

        } catch (error) { throw error; }
    }


    private formatFilters(filter: QueryFilter): QueryFilter {
        const { clientCode, userId, name, age, start, end } = filter;

        if (userId) {
            delete filter.userId;
            filter['user._id'] = userId;
        }
        if (clientCode) {
            delete filter.clientCode;
            filter['user.clientCode'] = clientCode;
        }
        if (name) {
            delete filter.name;
            filter['user.fullName'] = name;
        }

        if (start && end) {
            delete filter.start;
            delete filter.end;
            filter['dates.created'] = { $gte: moment(start, 'DD-MM-YYYY').startOf('day').valueOf(), $lte: moment(end, 'DD-MM-YYYY').endOf('day').valueOf() };
        }

        return filter;
    }

}
