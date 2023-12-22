import { CeilingAssignedEvent, CeilingCaeAssignedEvent, IncreaseCeilingBankEvent, IncreaseCeilingEvent, notificationEmmiter, RejectCeilingEvent, ValidCeilingEvent } from "modules/notifications";
import { RequestCeilingIncreaseRepository } from "./request-ceiling-increase.repository";
import { RequestCeilingIncreaseController } from "./request-ceiling-increase.controller";
import { Assignered, RequestCeilingIncrease } from "./model";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { isEmpty } from "lodash";
import moment from "moment";

export class RequestCeilingIncreaseService extends CrudService<RequestCeilingIncrease> {

    static requestCeilingIncreaseRepository: RequestCeilingIncreaseRepository;

    constructor() {
        RequestCeilingIncreaseService.requestCeilingIncreaseRepository = new RequestCeilingIncreaseRepository();
        super(RequestCeilingIncreaseService.requestCeilingIncreaseRepository);
    }

    async getRequestCeillingIncrease(filters: any) {
        try {
            this.formatFilters(filters);
            return await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAll(filters);
        } catch (error) { throw error; }
    }

    async insertRequestCeilling(ceiling: RequestCeilingIncrease): Promise<any> {
        try {
            const ceilingsTab = await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAll({ filter: { account: { ...ceiling.account } } });

            const resultat = ceilingsTab?.data.find((elm: any) => elm?.account?.ncp === ceiling?.account?.ncp &&
                elm?.status === ceiling?.status && elm.desiredCeiling.type === ceiling?.desiredCeiling?.type)

            if (resultat) { throw new Error('ApplicationNotProcessed'); }

            await RequestCeilingIncreaseController.requestCeilingIncreaseService.create(ceiling);

            notificationEmmiter.emit('increase-ceiling-mail', new IncreaseCeilingEvent(ceiling));
            notificationEmmiter.emit('increase-ceiling-bank-mail', new IncreaseCeilingBankEvent(ceiling));
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
            const assignered: Assignered = { fname: assignedUser.fname, lname: assignedUser.lname, email: assignedUser.email, tel: assignedUser.tel };
            const assignment = { assigner, assignered };

            const data = await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id: id }, {
                assignment,
                validator: {},
                status: 400,
                'dates.assigned': moment().valueOf()
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