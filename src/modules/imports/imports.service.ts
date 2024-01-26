
import { ExpenseCategory, OpeVisaStatus, VisaOperationsAttachment } from 'modules/visa-operations';
import { ValidationLevelSettingsController } from "modules/validation-level-settings";
import { generateAttachmentFromVoucher, generateValidator } from 'common/helpers';
import { ImportsController } from './imports.controller';
import { ImportsRepository } from './imports.repository';
import { saveAttachmentImportation } from './helper';
import { UsersController } from "modules/users";
import httpContext from 'express-http-context';
import { Voucher } from 'modules/vouchers';
import { CrudService } from "common/base";
import { Import } from './model';

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

    async updateImportation(_id: string, importation: Partial<Import>): Promise<any> {
        try {
            const authUser = httpContext.get('user');
            const steps = ('attachments' in importation) ? 'Ajout d\'opérations' : 'Apurement du dossier';
            const { EMPTY, TO_COMPLETED, REJECTED, TO_VALIDATED } = OpeVisaStatus;
            let oldImportation: Import = {};

            try { oldImportation = await ImportsController.importsService.findOne({ filter: { _id } }); } catch (error) { }

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
                { _id: authUser._id, fullName: authUser?.fullName, date: new Date().valueOf(), steps, },
            ];

            return await ImportsController.importsService.update({ _id }, importation);

            // TODO send notifications for client and bank
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

            if (!importation) { throw new Error('OnlinePaymentNotFound'); }
            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            let updateData: any = {};

            if (status === OpeVisaStatus.REJECTED) { updateData = { status, rejectReason }; }

            if (!importation?.validators?.length) { importation.validators = []; }

            importation.validators?.push(generateValidator(validator, user, status, rejectReason));

            if (rejectReason && importation.validators?.length) { importation.validators[importation.validators.length - 1].rejectReason = rejectReason; }

            if (!validator.fullRights && validator.level !== maxValidationLevelRequired && status !== OpeVisaStatus.REJECTED) {
                updateData.status = OpeVisaStatus.VALIDATION_CHAIN;
            }

            importation.editors = importation?.editors?.length ? importation?.editors : [];
            importation.editors?.push({
                _id: authUser._id,
                fullName: authUser?.fullName,
                date: new Date().valueOf(),
                steps: "Apurement du dossier d'importation"
            })

            importation = { ...importation, ...updateData };

            // TODO notify client when importation was apure (if importation.status  === OpeVisaStatus.JUSTIFY)

            return await ImportsController.importsService.update({ _id }, importation);
        } catch (error) { throw error; }
    }

}
