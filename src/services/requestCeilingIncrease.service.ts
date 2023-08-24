import { requestCeillingIncreaseCollection } from '../collections/requestCeilingIncrease.collection';
import { RequestCeilingIncrease, Validator } from '../models/request-ceiling-increase';
import { notificationService } from './notification.service';
import httpContext from 'express-http-context';
import { commonService } from './common.service';
import { logger } from '../winston';
import moment = require('moment');
import { isEmpty } from 'lodash';

export const requestCeillingIncreaseService = {

    insertRequestCeilling: async (ceiling: RequestCeilingIncrease): Promise<any> => {
        try {
            const ceilingsTab = await requestCeillingIncreaseCollection.getRequestBy(ceiling);

            const resultat = ceilingsTab.find((elm: any) => elm?.account?.ncp === ceiling?.account?.ncp &&
                elm?.status === ceiling?.status && elm.desiredCeiling.type === ceiling?.desiredCeiling?.type)

            if (resultat) {
                return Error('ApplicationNotProcessed');
            }
            await requestCeillingIncreaseCollection.insertRequestCeilling(ceiling);

            await Promise.all([
                notificationService.sendEmailIncreaseCeiling(ceiling),
                notificationService.sendEmailIncreaseCeilingBank(ceiling)
            ]);

        } catch (error) {
            logger.error(`\nError post visa operations  \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },

    getRequestCeillingIncrease: async (fields: any) => {
        commonService.parseNumberFields(fields);
        const { offset, limit, start, end, clientCode } = fields;
        delete fields.offset;
        delete fields.limit;
        delete fields.start;
        delete fields.end;
        if (clientCode) {
            delete fields.clientCode;
            fields['user.clientCode'] = clientCode;
        }

        const range = (start && end) ?
            { start: moment(start, 'DD/MM/YYYY').startOf('day').valueOf(), end: moment(end, 'DD/MM/YYYY').endOf('day').valueOf() }
            : undefined;

        return await requestCeillingIncreaseCollection.getRequestCeillingIncrease(fields || {}, offset || 0, limit || 40, range);
    },

    assignRequestCeiling: async (id: any, assignedUser: any) => {
        try {
            const user = httpContext.get('user');

            if (!((user.category >= 500) && (user.category <= 600))) { return new Error('Forbidden'); }

            if (!assignedUser) { return new Error('AssignedUserNotProvied'); }

            const ceilingReq = await requestCeillingIncreaseCollection.getCeilingById(id);

            if (isEmpty(ceilingReq)) { return new Error('CeilingNotFound'); }

            if (ceilingReq.status >= 400) { return new Error('AlreadyAssigned'); }

            const { _id, fname, lname } = user;
            const assigner = { _id, fname, lname };
            const assignered = { fname: assignedUser.fname, lname: assignedUser.lname, email: assignedUser.email, tel: assignedUser.tel };
            const assignment = { assigner, assignered };

            const data = await requestCeillingIncreaseCollection.updateCeiling(id, {
                assignment,
                validator: {},
                status: 400,
                'dates.assigned': moment().valueOf()
            });

            logger.info(`send ceiling assignment notification email`);

            Promise.all([
                await notificationService.sendEmailCeilingAssigned(ceilingReq, assignered),
                await notificationService.sendEmailCaeAssigned(ceilingReq, assignered)
            ]);
            return data;
        } catch (error) {
            logger.error(`\nError during ceiling assignment \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    RequestIncrease: async (id: string, body: { validator: any, status: number }) => {
        try {

            const authUser = httpContext.get('user');
            if (![600].includes(authUser?.category)) { return new Error('Forbidden'); }
            const ceiling = await requestCeillingIncreaseCollection.getCeilingById(id);

            if (!ceiling) { return new Error('CeilingNotFound'); }

            if ([200, 300].includes(ceiling?.status)) { return new Error('AllReadyValidate'); }

            ceiling.validator = body.validator;
            ceiling.status = body.status;
            console.log('col news', ceiling.validator, ceiling.status);


            // execute request confirmation process
            if (ceiling?.status === 200) {

                await requestCeillingIncreaseCollection.updateCeiling(id, ceiling);

                Promise.all([
                    // await notificationService.sendWelcomeSMS(user, password, user?.tel),
                    await notificationService.sendEmailValidCeiling(ceiling)
                ]);
            }

            // execute request reject process
            if (ceiling?.status === 300) {

                await requestCeillingIncreaseCollection.updateCeiling(id, ceiling);

                Promise.all([
                    // await notificationService.sendWelcomeSMS(user, password, user?.tel),
                    await notificationService.sendEmailRejectCeiling(ceiling)
                ]);
            }

        } catch (error) {
            logger.error(`failed to update user creation validator status \n${error.name} \n${error.stack}`);
            return error;
        }
    }

};