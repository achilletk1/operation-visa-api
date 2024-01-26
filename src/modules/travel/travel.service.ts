import { TravelJustifyLinkEvent } from "modules/notifications/notifications/mail/travel-justify-link/travel-justify-link.event";
import { notificationEmmiter, TravelDeclarationEvent, UploadedDocumentsOnExceededFolderEvent } from 'modules/notifications';
import { VisaCeilingType, VisaTransactionsCeilingsController } from "modules/visa-transactions-ceilings";
import { VisaTransactionsController } from "modules/visa-transactions/visa-transactions.controller";
import { generateValidator, getValidationsFolder, parseNumberFields } from "common/helpers";
import { getProofTravelStatus, getTravelStatus, saveAttachmentTravel } from "./helper";
import { ValidationLevelSettingsController } from "modules/validation-level-settings";
import { TravelMonth, TravelMonthController } from "modules/travel-month";
import { OpeVisaStatus, Validator } from "modules/visa-operations";
import { getOnpStatementStepStatus, getTotal } from 'common/utils';
import { UserCategory, UsersController } from 'modules/users';
import { CrudService, QueryOptions } from "common/base";
import { TravelRepository } from "./travel.repository";
import { TravelController } from './travel.controller';
import httpContext from 'express-http-context';
import generateId from 'generate-unique-id';
import { QueryFilter } from "common/types";
import { timeout } from "common/helpers";
import { config } from "convict-config";
import { get, isEmpty } from "lodash";
import { TravelType } from "./enum";
import { ObjectId } from "mongodb";
import { Travel } from "./model"
import crypt from 'url-crypt';;
import moment from "moment";

const { cryptObj, decryptObj } = crypt(config.get('exportSalt'));

export class TravelService extends CrudService<Travel> {

    static travelRepository: TravelRepository;

    constructor() {
        TravelService.travelRepository = new TravelRepository();
        super(TravelService.travelRepository);
    }

    // async findAll(query: QueryOptions) { return super.findAll(query) as unknown as { data: Travel[]; count: number; }; }

    async getTravels(query: QueryOptions) {
        try {
            query.filter = this.formatFilters(query.filter || {});
            return await TravelController.travelService.findAll(query);
        } catch (error) { throw error; }
    }

    async getValidationsTravel(_id: string) {
        try {
            const travel = await TravelController.travelService.findOne({ filter: { _id } });
            return getValidationsFolder(travel);
        } catch (error) { throw error; }
    }

    async getTravelRangesTransactions(fields: any): Promise<any> {
        try {
            const { transactionQuery, travelQuery } = this.formatRangeFilters(fields);
            const transactions = await VisaTransactionsController.visaTransactionsService.findAll({ filter: transactionQuery });

            if (transactions instanceof Error) { return transactions; }


            const travels = await TravelController.travelService.findAll({ filter: travelQuery })

            if (travels instanceof Error) { return travels; }

            return { travels: travels?.data, transactions: transactions?.data };
        } catch (error) { throw error; }
    }

    async insertTravel(travel: Travel): Promise<any> {
        try {
            const existingTravels = await TravelController.travelService.findAll({ filter: { 'user._id': get(travel, 'user._id'), $and: [{ 'proofTravel.dates.start': { $gte: travel.proofTravel?.dates?.start } }, { 'proofTravel.dates.end': { $lte: travel.proofTravel?.dates?.end } }] } });

            if (!isEmpty(existingTravels?.data)) { throw new Error('TravelExistingInThisDateRange') }
            // Set travel status to TO_VALIDATED
            travel.status = OpeVisaStatus.TO_COMPLETED;

            // Set proofTravel status to TO_VALIDATED
            travel.proofTravel.status = OpeVisaStatus.TO_COMPLETED;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: new Date().valueOf() };

            //========================== A supprimer =================
            // notificationService.sendEmailVisaExceding(travel, get(travel, 'user.email'), 1680252497051, travel.dates.created, 8000000)
            //========================= le code en commentaire ci dessus a été ecrit pour des tests et peut etre supprimer ===


            // insert ceiling in travel
            const { data } = await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findAll({ filter: { type: { '$in': [100, 400, 300] } } });
            const type = (+Number(travel.travelType) === TravelType.LONG_TERM_TRAVEL && +Number(travel?.proofTravel?.travelReason?.code) === 300) ? 400 : (travel.travelType === TravelType.LONG_TERM_TRAVEL) ? 300 : 100;
            travel.ceiling = data.find((elt: any) => +elt.type === type)?.value;

            // insert travel reference
            travel.travelRef = `${new Date().valueOf() + generateId({ length: 3, useLetters: false })}`;

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            travel.proofTravel.status = getProofTravelStatus({ ...travel }, maxValidationLevelRequired);
            // TODO get expenseDetails status from helper
            travel.status = getTravelStatus({ ...travel });

            const insertedId = await TravelController.travelService.create(travel);

            travel.proofTravel.proofTravelAttachs = saveAttachmentTravel(travel?.proofTravel?.proofTravelAttachs, insertedId?.data, travel.dates.created);

            await TravelController.travelService.update({ _id: insertedId?.data }, { proofTravel: travel.proofTravel });
            const updateTravel = await TravelController.travelService.findOne({ filter: { _id: insertedId?.data } });


            notificationEmmiter.emit('travel-declaration-mail', new TravelDeclarationEvent(updateTravel));
            // await Promise.all([
            //     NotificationsController.notificationsService.sendEmailTravelDeclaration(updateTravel, get(updateTravel, 'user.email')),
            //     // NotificationsController.notificationsService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), 'Déclaration de voyage', 'TravelDeclaration')
            // ]);

            return insertedId;

        } catch (error) { throw error; }
    }

    async insertTravelFromSystem(travel: Travel): Promise<any> {
        try {

            const user = await UsersController.usersService.findOne({ filter: { clientCode: get(travel, 'user.clientCode'), category: { $in: [UserCategory.DEFAULT, UserCategory.BILLERS] } } });

            if (user) {
                travel.user = {
                    ...travel.user,
                    _id: user?._id?.toString(),
                    fullName: `${user?.fname} ${user?.lname}`,
                    email: user?.email
                };
            }

            // Set request status to created
            travel.status = OpeVisaStatus.TO_COMPLETED;

            // Set travel creation date
            travel.proofTravel.status = OpeVisaStatus.TO_COMPLETED;

            const visaCeilingType = travel.proofTravel?.travelReason?.code === 300 ? VisaCeilingType.STUDYING_TRAVEL : VisaCeilingType.SHORT_TERM_TRAVEL;

            const ceiling = await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findOne({ filter: { type: visaCeilingType } });

            travel.ceiling = get(ceiling, 'value', 0);

            // insert travel reference
            travel.travelRef = `${new Date().valueOf() + generateId({ length: 3, useLetters: false })}`;

            const insertedId = await TravelController.travelService.create(travel);

            travel._id = insertedId?.data?.toString();

            return travel;

        } catch (error) { throw error; }
    }

    async updateTravelById(id: string = '', data: { travel: Partial<Travel>, steps: string[] }) {
        try {
            let { travel, steps } = data;
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 500 && authUser?.category < 700;

            const currentTravel = await TravelController.travelService.findOne({ filter: { _id: travel?._id?.toString() } });

            if (isEmpty(currentTravel)) { return new Error('TravelNotFound'); }

            if (travel?.proofTravel && travel?.proofTravel?.isEdit) {
                // travel.proofTravel.status = OpeVisaStatus.TO_COMPLETED;
                delete travel.proofTravel.isEdit;
            }

            if (travel?.proofTravel?.proofTravelAttachs?.length) {
                travel.proofTravel = { ...travel.proofTravel, proofTravelAttachs: saveAttachmentTravel(travel?.proofTravel?.proofTravelAttachs, id, travel?.dates?.created) };
                // travel.proofTravel.status = OpeVisaStatus.TO_VALIDATED;
            }

            if (travel?.transactions?.length) {
                for (let transaction of travel?.transactions || []) {
                    // if (transaction.status && !adminAuth && transaction.isEdit) { delete transaction.status }

                    // if (transaction.isEdit) {
                    //     // expenseDetail.status = OpeVisaStatus.TO_COMPLETED;
                    //     delete transaction.isEdit;
                    // }

                    if (!transaction?.attachments?.length) { continue; }
                    transaction.attachments = saveAttachmentTravel(transaction.attachments, id, travel?.dates?.created);

                    if (transaction.isExceed && transaction.nature) {
                        const index = transaction.attachments.findIndex(elt => elt.isRequired === true && !elt.path);
                        if (index === -1 && [OpeVisaStatus.EMPTY, OpeVisaStatus.TO_COMPLETED, null, undefined].includes(transaction.status as OpeVisaStatus)) {
                            transaction.status = OpeVisaStatus.TO_VALIDATED;
                        }
                    }
                }
            }

            if (travel?.othersAttachements?.length) {
                travel.othersAttachements = saveAttachmentTravel(travel?.othersAttachements || [], id, travel?.dates?.created);
            }

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            travel.proofTravel = { ...travel.proofTravel, status: getProofTravelStatus({ ...travel } as Travel, maxValidationLevelRequired) };
            // TODO get expenseDetails status from helper
            travel.status = getTravelStatus({ ...travel } as Travel);
            travel.editors = travel?.editors?.length ? travel.editors : [];
            travel?.editors?.push({
                _id: authUser._id,
                fullName: authUser?.fullName,
                date: new Date().valueOf(),
                steps: steps.toString() || 'Preuve de voyage'
            });
            travel.expenseDetailsStatus = getOnpStatementStepStatus(travel, 'expenseDetail');
            travel.expenseDetailAmount = getTotal(travel?.transactions);

            if (travel?.isUntimely) {
                let step = undefined;
                let firstIndexToValidateTransaction;
                if (currentTravel.proofTravel.status != travel.proofTravel.status && travel.proofTravel.status === OpeVisaStatus.TO_VALIDATED) { step = 'proofTravel'; }
                if (travel.transactions?.length) {
                    firstIndexToValidateTransaction = travel?.transactions?.findIndex((elt, i) => { elt.isExceed && (elt.status != currentTravel?.transactions[i]?.status && elt.status === OpeVisaStatus.TO_VALIDATED) });
                    if (firstIndexToValidateTransaction > -1) { step = (!step) ? 'expenseDetail' : 'expenseDetailAndProofTravel' }
                }
                if (travel && travel?.editors?.length && step) {
                    const lastEditorDate = travel.editors[travel?.editors?.length - 1 || 0]?.date || 0;
                    if (Math.abs(moment().diff(lastEditorDate, 'minutes')) >= 30) {
                        notificationEmmiter.emit(
                            'uploaded-documents-on-exceeded-folder-mail',
                            new UploadedDocumentsOnExceededFolderEvent(
                                { ref: travel?.travelRef?.toString() || '', fullName: travel.user?.fullName?.toString() },
                                'Voyage',
                                step,
                                firstIndexToValidateTransaction
                            )
                        );
                    }
                }
            }

            return await TravelController.travelService.update({ _id: id }, travel);
        } catch (error) { throw error; }
    }

    async updateTravelStepStatusById(_id: string, data: any) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 500 && authUser?.category < 700;

            if (!adminAuth) { throw new Error('Forbidden') }

            let stepData = [];

            const { status, step, rejectReason, validator, references, signature } = data;

            const { JUSTIFY, REJECTED, VALIDATION_CHAIN, TO_VALIDATED } = OpeVisaStatus;

            if (!step || !['proofTravel', 'expenseDetails', 'othersAttachements'].includes(step)) { throw new Error('StepNotProvided') };

            let travel = await TravelController.travelService.findOne({ filter: { _id } });

            if (!travel) { throw new Error('TravelNotFound'); }

            const user = await UsersController.usersService.findOne({ filter: { _id: validator._id } });

            if (status === REJECTED && (!rejectReason || rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            let updateData: any, tobeUpdated: any = {};

            updateData = { status };

            if (status === REJECTED) { updateData = { status, rejectReason }; }

            if (step === 'proofTravel') {
                let { proofTravel } = travel;
                proofTravel.validators = !proofTravel?.validators?.length ? [] : proofTravel.validators;
                proofTravel?.validators?.push(generateValidator(validator, user, status, rejectReason, signature));
                if (rejectReason && proofTravel.validators?.length) { proofTravel.validators[proofTravel.validators.length - 1].rejectReason = rejectReason; }

                if (!validator.fullRights && validator.level !== maxValidationLevelRequired && status !== REJECTED) {
                    updateData.status = VALIDATION_CHAIN;
                }
                proofTravel = { ...proofTravel, ...updateData };
                travel.proofTravel = proofTravel;
                // TODO generate this notification
                // notificationEmmiter.emit('travel-status-changed-mail', new TravelStatusChangedEvent(travel as Travel, 'reject', 'proofTravel', +validator.level === 1 ? 'frontoffice' :'backoffice'))

                // TODO notify next level if validator.level !== maxValidationLevelRequired
                tobeUpdated = { proofTravel };

                stepData.push('Preuve de voyage');
            }

            if (step === 'expenseDetails') {
                if (!references) { throw new Error('ReferenceNotProvided'); }

                const transactions = travel?.transactions || [];

                stepData.push('État détaillé des dépenses');

                if (!travel.validators?.length) { travel.validators = []; }
                const indexes: number[] = [];

                for (const transactionMatch of references) {

                    const transactionIndex = transactions?.findIndex(elt => elt.match === transactionMatch);

                    if (transactionIndex && transactionIndex < 0) { throw new Error('BadReference'); }

                    transactions[transactionIndex] = { ...transactions[transactionIndex], ...updateData }
                    indexes.push(transactionIndex);

                }

                travel.validators?.push(generateValidator(validator, user, status, rejectReason, signature, indexes));

                if (transactions.findIndex(e => e.isExceed && e.status !== JUSTIFY) === -1) {
                    if (maxValidationLevelRequired !== travel.expenseDetailsLevel) {
                        tobeUpdated.expenseDetailsLevel = (travel?.expenseDetailsLevel || 1) + 1;
                        transactions.forEach(e => e.status = VALIDATION_CHAIN);
                    }
                }

                if (rejectReason) {
                    tobeUpdated.expenseDetailsLevel = 1;
                    transactions.forEach(e => e.status === VALIDATION_CHAIN && (e.status = TO_VALIDATED));
                }

                tobeUpdated.transactions = transactions;

            }

            travel.editors = travel?.editors?.length ? travel.editors : [];
            travel?.editors?.push({
                _id: authUser._id,
                fullName: authUser?.fullName,
                date: new Date().valueOf(),
                steps: stepData.toString()
            });

            travel.expenseDetailsStatus = getOnpStatementStepStatus(travel, 'expenseDetail');

            travel = { ...travel, ...tobeUpdated };
            travel.proofTravel.status = getProofTravelStatus({ ...travel }, maxValidationLevelRequired);
            travel.status = getTravelStatus(travel);
            travel.expenseDetailAmount = getTotal(travel?.transactions);
            if (step === 'proofTravel') {
                // travel = await this.verifyTravelTransactions(_id, travel);
            }

            return await TravelController.travelService.update({ _id }, travel);
        } catch (error) { throw error; }
    }

    private async verifyTravelTransactions(id: string, travel: Travel): Promise<any> {

        const existingTravels = await TravelController.travelService.findAll({ filter: { _id: { $ne: new ObjectId(id) }, "user.clientCode": travel?.user?.clientCode, "proofTravel.dates.start": { $gte: travel?.proofTravel?.dates?.start }, "proofTravel.dates.end": { $lte: travel?.proofTravel?.dates?.end } } });

        if (isEmpty(existingTravels)) { return travel; }

        const ids = [];
        for (const data of existingTravels?.data) {
            // travel.proofTravel.continents.push(...data.proofTravel.continents);
            // travel.proofTravel.countries.push(...data.proofTravel.countries);
            travel?.proofTravel?.proofTravelAttachs?.push(...(data?.proofTravel?.proofTravelAttachs || []));
            if (data.proofTravel.isTransportTicket) { travel.proofTravel.isTransportTicket = true; }
            if (data.proofTravel.isVisa) { travel.proofTravel.isVisa = true; }
            if (data.proofTravel.isPassIn) { travel.proofTravel.isPassIn = true; }
            if (data.proofTravel.isPassOut) { travel.proofTravel.isPassOut = true; }
            travel.transactions.push(...data?.transactions);
            ids.push(new ObjectId(data._id.toString()));
        }

        // travel.proofTravel.continents = [...new Set(travel?.proofTravel?.continents)];
        const countries: any[] = [];
        // (travel?.proofTravel?.countries || []).forEach((elt) => {
        //     if (!countries.find((e) => e.name === elt?.name)) { countries.push(elt) }
        // });

        // travel.proofTravel.countries = countries;

        await TravelController.travelService.deleteMany({ _id: { $in: ids } });

        const dayDiff = moment(travel?.proofTravel?.dates?.end).diff(travel?.proofTravel?.dates?.start, 'days');

        travel.travelType = dayDiff > 30 ? TravelType.LONG_TERM_TRAVEL : TravelType.SHORT_TERM_TRAVEL;

        const travelMonths: TravelMonth[] = [];

        if (travel?.travelType === TravelType.LONG_TERM_TRAVEL) {
            const monthDiff = moment(travel?.proofTravel?.dates?.end).diff(travel?.proofTravel?.dates?.start, 'M');
            for (let index = 0; index < monthDiff; index++) {

                const month = moment(travel?.proofTravel?.dates?.start).add(index, 'M').format('YYYYMM').toString();

                const transactionsMonth = travel.transactions.filter((elt) => elt.currentMonth === +month);

                // const expenseDetailMonth = travel?.expenseDetails.filter((elt) => moment(elt.date).format('YYYYMM').toString() === month);

                if (isEmpty(transactionsMonth)) { continue; }

                const travelMonth: TravelMonth = {
                    status: OpeVisaStatus.TO_COMPLETED,
                    userId: travel?.user?._id,
                    travelId: travel?._id.toString(),
                    month,
                    dates: {
                        created: new Date().valueOf(),
                    },
                    // expenseDetails: expenseDetailMonth,
                    expenseDetailsStatus: OpeVisaStatus.EMPTY,
                    expenseDetailAmount: 0,
                    transactions: transactionsMonth,
                }

                travelMonths.push(travelMonth);

            }

            if (!isEmpty(travelMonths)) { await TravelMonthController.travelMonthService.insertManyVisaTravelMonth(travelMonths) }
        }
        return travel;
    }

    private formatFilters(filter: QueryFilter): QueryFilter {
        const { clientCode, userId, name } = filter;

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

        return filter;
    }

    private formatRangeFilters(filters: any) {
        const { start, end, clientCode } = filters;
        parseNumberFields(filters);
        let transactionQuery: any;
        let travelQuery: any;

        if (start) {
            transactionQuery = { date: { $gte: +start } };
            travelQuery = { "proofTravel.dates.start": { $gte: +start } };
        }
        if (end) {
            transactionQuery.date['$lte'] = +end;
            travelQuery = { ...travelQuery, "proofTravel.dates.end": { $lte: +end } };
        }
        if (clientCode) {
            transactionQuery.clientCode = clientCode;
            travelQuery['user.clientCode'] = clientCode
        }

        return { transactionQuery, travelQuery };
    }

    async getTravelReport(params: { status: any, start: number, end: number, travelType?: any }) {
        try { return await TravelService.travelRepository.getTravelReport(params); }
        catch (error) { throw error; }
    }

    async getStatusOperationTravelReport(params: { filterStatus: any, start: number, end: number, travelType?: any, agencyCode: string, regionCode: string }) {
        try { return await TravelService.travelRepository.getStatusOperationTravelReport(params); }
        catch (error) { throw error; }
    }

    async getAverageTimeJustifyTravelReport(params: { status: any, start: number, end: number, travelType?: any }) {
        try { return await TravelService.travelRepository.getAverageTimeJustifyTravelReport(params); }
        catch (error) { throw error; }
    }

    async getChartDataTravel(params: { start: number, end: number, travelType?: any }) {
        try { return await TravelService.travelRepository.getChartDataTravel(params); }
        catch (error) { throw error; }
    }

    async getTravelsForPocessing(params: { date: number; cli: string; travelType?: TravelType | any; }) {
        try { return await TravelService.travelRepository.getTravelsForPocessing(params); }
        catch (error) { throw error; }
    }

    async getTravelNotifications() {
        try { return await TravelService.travelRepository.getTravelNotifications(); }
        catch (error) { throw error; }
    }

    async sendLinkNotification(data: any) {

        try {
            const travel = await this.baseRepository.findOne({ filter: { _id: data.id } });

            if (isEmpty(travel)) { return new Error('TravelNotFound') }

            if (travel) {
                notificationEmmiter.emit('travel-justify-link', new TravelJustifyLinkEvent(travel, data.link));
            }
        } catch (error) { throw error; }
    }

    async generateQueryLink(id: any, resetLink?: 'conserve' | 'reset') {
        try {
            const travel: any = await this.baseRepository.findOne({ filter: { _id: id } });
            if (!travel) { return new Error('travelNotFound') };
            timeout(5000);

            if (travel?.link) {
                const code = decryptObj(travel?.link);
                const { ttl } = code;
                if ((new Date()).getTime() >= ttl) { return await this.getLink(id) };

                if (resetLink === 'reset') { return await this.getLink(id) };

                if (resetLink === 'conserve') {
                    // const link = `/visa-operations/client/ept-and-atm-withdrawal/receipts?query=${code}`;
                    return travel?.link
                };

                return new Error('validLink')
            }


            const link = await this.getLink(id);

            return { link }
        } catch (error) { throw error; }
    }

    private async getLink(id: string) {
        const ttl = moment().add(config.get('clientLinkTTL'), 'seconds').valueOf();

        const options = { ttl, id };
        const code = cryptObj(options);

        const basePath = `/ept-and-atm-withdrawal/receipts`;
        const link = `${basePath}?query=${code}`;
        await TravelController.travelService.update({ _id: id }, { link: link });
        return link
    }

}
