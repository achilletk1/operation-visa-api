import { CeilingAssignedEvent, CeilingCaeAssignedEvent, IncreaseCeilingBankEvent, IncreaseCeilingEvent, notificationEmmiter, RejectCeilingEvent, ValidCeilingEvent } from "modules/notifications";
import { RequestCeilingIncreaseRepository } from "./request-ceiling-increase.repository";
import { RequestCeilingIncreaseController } from "./request-ceiling-increase.controller";
import { IncreaseCeilingSmsEvent, RejectTemplateSmsEvent } from "modules/notifications";
import { convertParams, extractPaginationData, getAgenciesQuery } from "common/helpers";
import { ValidationLevelSettingsController } from "modules/validation-level-settings";
import { deleteDirectory, readFile, saveAttachment } from "common/utils";
import { getAccountManagerOrAgencyHeadCcEmail } from "common/services";
import { AssignTo, RequestCeilingIncrease } from "./model";
import { CrudService, QueryOptions } from "common/base";
import { SettingsController } from "modules/settings";
import httpContext from 'express-http-context';
import { isEmpty } from "lodash";
import { Status } from "./enum";
import moment from "moment";

export class RequestCeilingIncreaseService extends CrudService<RequestCeilingIncrease> {

    static requestCeilingIncreaseRepository: RequestCeilingIncreaseRepository;

    constructor() {
        RequestCeilingIncreaseService.requestCeilingIncreaseRepository = new RequestCeilingIncreaseRepository();
        super(RequestCeilingIncreaseService.requestCeilingIncreaseRepository);
    }

    async getRequestCeilingIncrease(query: any) {
        try {
            const { clientCode } = query.filter; delete query?.filter?.clientCode;

            query = convertParams(query || {});
            query = extractPaginationData(query || {});
            if (query?.filter?.start && query?.filter?.end) {
                delete query?.filter?.start; delete query?.filter?.end;
                query = {
                    ...query, start: moment(query?.filter?.start, 'DD-MM-YYYY').startOf('day').valueOf(),
                    end: moment(query?.filter?.end, 'DD-MM-YYYY').endOf('day').valueOf()
                } as QueryOptions;
            }

            if (clientCode) query.filter['user.clientCode'] = clientCode;
            const data = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAllAggregate<RequestCeilingIncrease>(getAgenciesQuery(query));
            delete query.offset; delete query.limit;
            const total = (await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAllAggregate<RequestCeilingIncrease>(getAgenciesQuery(query))).length;
            return { data, total };
        } catch (error) { throw error; }
    }

    async insertRequestCeiling(ceiling: RequestCeilingIncrease): Promise<any> {
        try {
            const authUser = httpContext.get('user');
            const { data } = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAll({ filter: { cardType: { ...ceiling.cardType }, status: { $nin: [Status.VALIDATED, Status.REJECTED] } } });

            if (data.length) throw new Error('ApplicationNotProcessed');

            const insertionId = (await RequestCeilingIncreaseController.requestCeilingIncreaseService.create(ceiling))?.data?.toString();
            const insertedCeiling = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findOne({ filter: { _id: insertionId } });

            for (let attachment of ceiling?.othersAttachements || []) {
                if (!attachment.temporaryFile) { continue; }
                const content = readFile(String(attachment?.temporaryFile?.path));
                if (!content) { continue; }
                attachment.content = content;
                attachment = saveAttachment(insertedCeiling._id, attachment, insertedCeiling.dates?.created, 'ceilingIncreaseRequest');
                attachment.dates = { created: new Date().valueOf() };
                deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
                delete attachment.temporaryFile;
            }

            await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id: insertionId }, ceiling);

            const bankUser = await SettingsController.settingsService.findOne({ filter: { key: 'email_bank' } });

            notificationEmmiter.emit('increase-ceiling-mail', new IncreaseCeilingEvent(ceiling));
            notificationEmmiter.emit('increase-ceiling-sms', new IncreaseCeilingSmsEvent(ceiling, authUser?.tel));
            notificationEmmiter.emit('increase-ceiling-bank-mail', new IncreaseCeilingBankEvent(ceiling, bankUser?.data));

            // await Promise.all([
            //     NotificationsController.notificationsService.sendEmailIncreaseCeiling(ceiling),
            //     NotificationsController.notificationsService.sendEmailIncreaseCeilingBank(ceiling)
            // ]);

        } catch (error) { throw error; }
    }

    async assignRequestCeiling(id: any, assignedUser: any) {
        try {
            const user = httpContext.get('user');

            if (!((user.category >= 500) && (user.category <= 600))) { throw new Error('Forbidden'); }

            if (!assignedUser) { throw new Error('AssignedUserNotProvied'); }

            const ceilingReq = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findOne({ filter: { _id: id } });

            if (isEmpty(ceilingReq)) { throw new Error('CeilingNotFound'); }

            if (Number(ceilingReq.status) >= 400) { throw new Error('AlreadyAssigned'); }

            const { _id, fname, lname } = user;
            const assigner = { _id, fname, lname };
            const assignTo: AssignTo = { fname: assignedUser.fname, lname: assignedUser.lname, email: assignedUser.email, tel: assignedUser.tel };
            const assignment = { assigner, assignered: assignTo };

            const data = await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id: id }, {
                assignment,
                validator: {},
                status: 400,
                'dates.assigned': new Date().valueOf()
            });

            this.logger.info(`send ceiling assignment notification email`);

            notificationEmmiter.emit('ceiling-assigned-mail', new CeilingAssignedEvent(ceilingReq, assignTo));
            notificationEmmiter.emit('ceiling-cae-assigned-mail', new CeilingCaeAssignedEvent(ceilingReq, assignTo));
            // await Promise.all([
            //     NotificationsController.notificationsService.sendEmailCeilingAssigned(ceilingReq, assignTo),
            //     NotificationsController.notificationsService.sendEmailCaeAssigned(ceilingReq, assignTo)
            // ]);
            return data;
        } catch (error) { throw error; }
    }

    async requestIncrease(_id: string, body: { validators: any, status: number }) {
        try {
            const authUser = httpContext.get('user');
            const { INPROGRESS, REJECTED, VALIDATED } = Status;
            const validator = body?.validators[0];

            // if (![600].includes(authUser?.category)) { throw new Error('Forbidden'); }

            let ceiling = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findOne({ filter: { _id } });
            if (!ceiling) { throw new Error('CeilingNotFound'); }

            if ([VALIDATED, REJECTED].includes(Number(ceiling?.status))) { throw new Error('AllReadyValidate'); }
            if (body?.status === REJECTED && (!validator?.rejectReason || validator?.rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }
            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            ceiling.validators = ceiling.validators ?? [];
            ceiling.validators.push(...body.validators);
            ceiling.status = body.status;

            if (!validator.fullRights && validator.level !== +maxValidationLevelRequired && body?.status !== REJECTED) ceiling.status = INPROGRESS;

            // execute request confirmation process
            if (ceiling?.status === VALIDATED) {
                notificationEmmiter.emit('valid-ceiling-mail', new ValidCeilingEvent(ceiling));
                notificationEmmiter.emit('increase-ceiling-sms', new IncreaseCeilingSmsEvent(ceiling, authUser?.tel));
                // await Promise.all([
                //     // NotificationsController.notificationsService.sendWelcomeSMS(user, password, user?.tel),
                //     NotificationsController.notificationsService.sendEmailValidCeiling(ceiling)
                // ]);
            }

            // execute request reject process
            if (ceiling?.status === REJECTED) {
                ceiling = { ...ceiling, rejectReason: validator?.rejectReason };

                // send notifications
                const ccEmail = await getAccountManagerOrAgencyHeadCcEmail(undefined, undefined, { _id: ceiling?.user?._id });
                notificationEmmiter.emit('reject-ceiling-mail', new RejectCeilingEvent(ceiling, ccEmail));
                notificationEmmiter.emit('reject-template-sms', new RejectTemplateSmsEvent(ceiling, authUser?.tel, 'RequestCeilingIncrease'));
            }

            // execute request in progress
            await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id }, ceiling);
            // notificationEmmiter.emit('ceiling-inprogress-mail', new CeilingInProgressEvent(ceiling));


        } catch (error) { throw error; }
    }

}