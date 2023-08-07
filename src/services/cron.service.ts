import { visaTransactonsProcessingService } from "./visa-transaction-processing.service";
import { onlinePaymentsCollection } from "../collections/online-payments.collection";
import { lettersCollection } from "../collections/letters.collection";
import { travelsCollection } from "../collections/travels.collection";
import { temporaryFilesService } from "./temporary-files.service";
import { onlinePaymentsService } from "./online-payment.service";
import { OnlinePaymentMonth } from "../models/online-payment";
import { notificationService } from "./notification.service";
import { Travel } from "../models/travel";
import { logger } from "../winston";
import { config } from "../config";
import { isEmpty } from "lodash";
import cron from 'node-cron';
import moment from "moment";

export const cronService = {
    // exceding verifications, travel detections and online payment detection process
    startTransactionsProcessing: async (): Promise<void> => {
        const cronExpression = `${config.get('cronTransactionProcessing')}`;

        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startTransactionsProcessing();
            } catch (error) {
                logger.error(`start transactions processing failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // formal notice letter sending and justifications revival process
    startRevivalMail: async (): Promise<void> => {
        const cronExpression = `${config.get('cronRevivalMail')}`;
        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startRevivalMail();
            } catch (error) {
                logger.error(`start revival mail failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // remove temporaries files which exeeded the expire time
    startRemoveTemporaryFiles: async (): Promise<void> => {
        const cronExpression = `${config.get('cronDeleteTemporaryFile')}`;
        cron.schedule(cronExpression, async () => {
            try {
                await temporaryFilesService.removeTemporaryFiles();
            } catch (error) {
                logger.error(`start revival mail failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // delete Travel with exceeding ceiling
    startRemoveTravelsWithoutExceeding: async (): Promise<void> => {
        const cronExpression = `${config.get('cronRemoveOnlinePaymentsWithExceedings')}`;
        cron.schedule(cronExpression, async () => {
            try {
                await onlinePaymentsService.removeOnlinePaymentsWithExceedings();
            } catch (error) {
                logger.error(`start travel with exceeding ceiling failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // detect users who have not justified their transactions outside the cemac zone and send them a letter of formal notice
    detectUsersNotJustifiedTransaction: async (): Promise<void> => {
        // const cronExpression = `${config.get('cronTransactionProcessing')}`;
        let usersLockTravel: any;
        let usersLockOnlinePayment: any;

        cron.schedule("* * * * * *", async () => {
            try {
                const travel: Travel[] = await travelsCollection.getTravelsBy({ status: { $in: [500] } });
                if (!isEmpty(travel)) { usersLockTravel = await getCustomerAccountBlocked(travel) };

                const onlinePayment: OnlinePaymentMonth[] = await onlinePaymentsCollection.getOnlinePaymentsBy({ status: { $in: [500] } });
                if (!isEmpty(onlinePayment)) { usersLockOnlinePayment = await getCustomerAccountBlocked(onlinePayment) }

                if (!isEmpty(usersLockTravel) || !isEmpty(usersLockOnlinePayment)) {
                    // await notificationService.sendEmailUsersBloqued(usersLockTravel.concat(usersLockOnlinePayment))
                }

            } catch (error) {
                logger.error(`detect users not justified transaction failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },


};

//the list of customers whose accounts must be blocked
const getCustomerAccountBlocked = async (dataOperation: any[]) => {
    let dataTab: any[] = [];
    const letters = await lettersCollection.getLettersBy({ key: 'mise en demeure' });
    const timeLimit = +letters[0]?.period.substring(2, 4);

    dataOperation.forEach((element: any) => {
        if (element?.transactions) {
            const dateDiffInDays = moment().diff(moment(element?.transactions[0]?.date), 'days');
            if (dateDiffInDays > timeLimit) { dataTab.push(element?.user) }
        }
    })

    return dataTab || [];
}

