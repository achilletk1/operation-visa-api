import { CeilingAssignedEvent, CeilingCaeAssignedEvent, IncreaseCeilingBankEvent, IncreaseCeilingEvent, notificationEmmiter, RejectCeilingEvent, ValidCeilingEvent } from "modules/notifications";
import { RequestCeilingIncreaseRepository } from "./request-ceiling-increase.repository";
import { RequestCeilingIncreaseController } from "./request-ceiling-increase.controller";
import { deleteDirectory, readFile, saveAttachment } from "common/utils";
import { AssignTo, RequestCeilingIncrease } from "./model";
import { SettingsController } from "modules/settings";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { isEmpty } from "lodash";
import { Status } from "./enum";

export class RequestCeilingIncreaseService extends CrudService<RequestCeilingIncrease> {

    static requestCeilingIncreaseRepository: RequestCeilingIncreaseRepository;

    constructor() {
        RequestCeilingIncreaseService.requestCeilingIncreaseRepository = new RequestCeilingIncreaseRepository();
        super(RequestCeilingIncreaseService.requestCeilingIncreaseRepository);
    }

    async getRequestCeilingIncrease(filters: any) {
        try {
            this.formatFilters(filters);
            return await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAll(filters);
        } catch (error) { throw error; }
    }

    async insertRequestCeiling(ceiling: RequestCeilingIncrease): Promise<any> {
        try {
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
            const assignered: AssignTo = { fname: assignedUser.fname, lname: assignedUser.lname, email: assignedUser.email, tel: assignedUser.tel };
            const assignment = { assigner, assignered };

            const data = await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id: id }, {
                assignment,
                validator: {},
                status: 400,
                'dates.assigned': new Date().valueOf()
            });

            this.logger.info(`send ceiling assignment notification email`);

            notificationEmmiter.emit('ceiling-assigned-mail', new CeilingAssignedEvent(ceilingReq, assignered));
            notificationEmmiter.emit('ceiling-cae-assigned-mail', new CeilingCaeAssignedEvent(ceilingReq, assignered));
            // await Promise.all([
            //     NotificationsController.notificationsService.sendEmailCeilingAssigned(ceilingReq, assignered),
            //     NotificationsController.notificationsService.sendEmailCaeAssigned(ceilingReq, assignered)
            // ]);
            return data;
        } catch (error) { throw error; }
    }

    async requestIncrease(_id: string, body: { validator: any, status: number }) {
        try {

            const authUser = httpContext.get('user');

            if (![600].includes(authUser?.category)) { throw new Error('Forbidden'); }

            const ceiling = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findOne({ filter: { _id } });

            if (!ceiling) { throw new Error('CeilingNotFound'); }

            if ([200, 300].includes(Number(ceiling?.status))) { throw new Error('AllReadyValidate'); }

            ceiling.validator = body.validator;
            ceiling.status = body.status;

            // execute request confirmation process
            if (ceiling?.status === 200) {

                await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id }, ceiling);

                notificationEmmiter.emit('valid-ceiling-mail', new ValidCeilingEvent(ceiling));
                // await Promise.all([
                //     // NotificationsController.notificationsService.sendWelcomeSMS(user, password, user?.tel),
                //     NotificationsController.notificationsService.sendEmailValidCeiling(ceiling)
                // ]);
            }

            // execute request reject process
            if (ceiling?.status === 300) {

                await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id }, ceiling);

                notificationEmmiter.emit('reject-ceiling-mail', new RejectCeilingEvent(ceiling));
                // await Promise.all([
                //     // NotificationsController.notificationsService.sendWelcomeSMS(user, password, user?.tel),
                //     NotificationsController.notificationsService.sendEmailRejectCeiling(ceiling)
                // ]);
            }

            // execute request in progress
            await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id }, ceiling);
            // notificationEmmiter.emit('ceiling-inprogress-mail', new CeilingInProgressEvent(ceiling));


        } catch (error) { throw error; }
    }

    private formatFilters(filters: any) {
        const { clientCode } = filters;

        if (clientCode) {
            delete filters.clientCode;
            filters['user.clientCode'] = clientCode;
        }
    }

}