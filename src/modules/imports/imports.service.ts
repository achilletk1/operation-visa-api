
import { convertParams, extractPaginationData, generateAttachmentFromVoucher, generateValidator, getAgenciesQuery, getDifferenceBetweenObjects } from 'common/helpers';
import { notificationEmmiter, ImportDeclarationEvent, DeclarationTemplateSmsEvent, RejectTemplateSmsEvent, RejectImportEvent } from 'modules/notifications';
import { ExpenseCategory, OpeVisaStatus, VisaOperationsAttachment } from 'modules/visa-operations';
import { ValidationLevelSettingsController } from "modules/validation-level-settings";
import { getAccountManagerOrAgencyHeadCcEmail } from 'common/services';
import { ImportsController } from './imports.controller';
import { ImportsRepository } from './imports.repository';
import { CrudService, QueryOptions } from "common/base";
import { saveAttachmentImportation } from './helper';
import { UsersController } from "modules/users";
import httpContext from 'express-http-context';
import { Voucher } from 'modules/vouchers';
import { Import } from './model';
import moment from 'moment';

const expenseCategories = [{
    code: ExpenseCategory.IMPORT_OF_GOODS,
    label: `importation de biens`,
    vouchers: [
        { label: `Facture pro Format`, isRequired: true },
        { label: `Déclaration d'importation`, isRequired: true },
        { label: `Numéro d'identification fiscal`, isRequired: false },
        { label: `Autorisation(produits soumis a restriction)`, isRequired: false }
    ]
},
{
    code: ExpenseCategory.IMPORT_OF_SERVICES,
    label: `importation de services`,
    vouchers: [
        { label: `Importez la Facture pro Format ou Bon de commande`, isRequired: true },
        { label: `Contrat de service dûment enregistré`, isRequired: true },
        { label: `Numéro d'identification fiscal`, isRequired: false },
        { label: `Déclaration d\'importation de services à la Banque centrale`, isRequired: false },
    ],
}];

export class ImportsService extends CrudService<Import> {

    static importsRepository: ImportsRepository;

    constructor() {
        ImportsService.importsRepository = new ImportsRepository();
        super(ImportsService.importsRepository);
    }

    async insertImportation(importation: Import): Promise<any> {
        try {
            const authUser = httpContext.get('user');
            const result = await ImportsController.importsService.create(importation);
            notificationEmmiter.emit('import-declaration-mail', new ImportDeclarationEvent(importation));
            notificationEmmiter.emit('import-declaration-sms', new DeclarationTemplateSmsEvent(importation, authUser?.tel));
            return result;
        } catch (error) { throw error; }
    }

    async updateImportation(_id: string, importation: Partial<Import>): Promise<any> {
        try {
            const authUser = httpContext.get('user');
            const steps = ('attachments' in importation) ? 'Ajout d\'opérations' : 'Apurement du dossier';
            const { EMPTY, TO_COMPLETED, REJECTED, TO_VALIDATED } = OpeVisaStatus;
            let oldImportation: Import = {};

            try { oldImportation = await ImportsController.importsService.findOne({ filter: { _id } }); } catch (error) { }
            const { newVersion, oldVersion } = getDifferenceBetweenObjects(importation, oldImportation);

            // Update from imports history, Partial<importation> like { attachments } 
            if (importation?.attachments?.length && importation?.attachments instanceof Array) {
                importation.attachments = saveAttachmentImportation(importation.attachments, importation?._id, importation?.created_at);

                if ([EMPTY, TO_COMPLETED, REJECTED].includes(importation?.status as OpeVisaStatus)) {
                    if (oldImportation?.finalPayment && this.checkIfAllRequireAttachmentAreUploaded(importation?.attachments)) {
                        importation.status = TO_VALIDATED;
                    }
                }
            }

            // Update from operation-justifs-component on shared, Partial<importation> like { status, transactions, finalPayment }; 
            if (importation?.finalPayment) {
                if (this.checkIfAllRequireAttachmentAreUploaded(oldImportation?.attachments)) {
                    importation.status = TO_VALIDATED;
                }
                if (!oldImportation?.attachments?.length) {
                    importation.attachments = [];
                    const vouchers: Voucher[] = importation?.type?.code === ExpenseCategory.IMPORT_OF_GOODS ? expenseCategories[0].vouchers : expenseCategories[1].vouchers;
                    importation.attachments?.push(...vouchers.map(voucher => generateAttachmentFromVoucher(voucher, true)));
                }
                // TODO sent final notification to inform client counter of 30 days start to apure importation folder
            }

            importation.editors = [
                ...(oldImportation?.editors ?? []),
                { _id: authUser?._id, fullName: authUser?.fullName, date: new Date().valueOf(), steps, oldVersion, newVersion, },
            ];
            const result = await ImportsController.importsService.update({ _id }, importation);
            const updatedImportation = await ImportsController.importsService.findOne({ filter: { _id } });

            // TODO send notifications for client and bank

            notificationEmmiter.emit('import-declaration-mail', new ImportDeclarationEvent(updatedImportation));
            notificationEmmiter.emit('import-declaration-sms', new DeclarationTemplateSmsEvent(updatedImportation, authUser?.tel));
            return result;
        } catch (error) { throw error; }
    }

    private checkIfAllRequireAttachmentAreUploaded(attachments: VisaOperationsAttachment[] = []): boolean {
        for (const attachment of attachments)
            if (attachment.isRequired && !attachment?.contentType) return false;
        return true;
    }

    async updateImportationStatusById(_id: string, data: any) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 500 && authUser?.category < 700;

            if (!adminAuth) { throw new Error('Forbidden'); }

            const { status, validator, rejectReason } = data;
            let importation!: Import;

            try { importation = await ImportsController.importsService.findOne({ filter: { _id: _id } }); } catch { }
            const user = await UsersController.usersService.findOne({ filter: { _id: validator._id } });

            if (!importation) { throw new Error('ImportationNotFound'); }
            if (importation?.initiator?._id === authUser?._id) { throw new Error('UnauthorizedUser') }
            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            let updateData: any = { status };

            if (status === OpeVisaStatus.REJECTED) { updateData = { status, rejectReason }; }

            if (!importation?.validators?.length) { importation.validators = []; }

            importation.validators?.push(generateValidator(validator, user, status, rejectReason));

            if (rejectReason && importation.validators?.length) { importation.validators[importation.validators.length - 1].rejectReason = rejectReason; }

            if (!validator.fullRights && validator.level !== maxValidationLevelRequired && status !== OpeVisaStatus.REJECTED) {
                updateData.status = OpeVisaStatus.VALIDATION_CHAIN;
            }

            importation.editors = importation?.editors?.length ? importation?.editors : [];
            importation.editors?.push({
                _id: authUser?._id,
                fullName: authUser?.fullName,
                date: new Date().valueOf(),
                steps: "Apurement du dossier d'importation"
            })

            importation = { ...importation, ...updateData };

            // TODO notify client when importation was apure (if importation.status  === OpeVisaStatus.JUSTIFY)

            const result = await ImportsController.importsService.update({ _id }, importation);

            if (status === OpeVisaStatus.REJECTED) {
                const ccEmail = await getAccountManagerOrAgencyHeadCcEmail(user.userGesCode, user?.age?.code);
                notificationEmmiter.emit('reject-import-mail', new RejectImportEvent(importation, ccEmail));
                notificationEmmiter.emit('reject-template-sms', new RejectTemplateSmsEvent(importation, authUser?.tel, 'Import'));
            }
            return result;
        } catch (error) { throw error; }
    }

    async getImportationsAgencies(query: QueryOptions) {
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

            if (query?.filter?.platform && ('backoffice').includes(query?.filter?.platform)) {
                query.filter = { ...query?.filter, status: { $in: [OpeVisaStatus.TO_COMPLETED, OpeVisaStatus.TO_VALIDATED, OpeVisaStatus.VALIDATION_CHAIN] } };
                delete query?.filter?.platform;
            }

            const data = await ImportsController.importsService.findAllAggregate<Import>(getAgenciesQuery(query));
            delete query.offset; query.limit;
            const total = (await ImportsController.importsService.findAllAggregate<Import>(getAgenciesQuery(query))).length;
            return { data, total };
        } catch (error) { throw error; }
    }

}
