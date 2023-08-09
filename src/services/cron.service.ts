import { visaTransactonsProcessingService } from "./visa-transaction-processing.service";
import { onlinePaymentsCollection } from "../collections/online-payments.collection";
import { templatesCollection } from "../collections/templates.collection";
import { travelsCollection } from "../collections/travels.collection";
import { temporaryFilesService } from "./temporary-files.service";
import { onlinePaymentsService } from "./online-payment.service";
import { notificationService } from "./notification.service";
import { OpeVisaStatus } from "../models/visa-operations";
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
        cron.schedule(`${config.get('cronclientindemeure')}`, async () => {
            try {
                const travelsExcedeed: any[] = await travelsCollection.getTravelsBy({ status: { $in: [OpeVisaStatus.EXCEDEED] } });
                const onlinePaymentsExcedeed: any[] = await onlinePaymentsCollection.getOnlinePaymentsBy({ status: { $in: [OpeVisaStatus.EXCEDEED] } });
                let transactionsExcedeed: any = [];

                transactionsExcedeed = await getCustomerAccountToBlocked([...travelsExcedeed, ...onlinePaymentsExcedeed]);

                if (!isEmpty(transactionsExcedeed)) {
                    await notificationService.sendEmailUsersBloqued(transactionsExcedeed)
                }

            } catch (error) {
                logger.error(`detect users not justified transaction failed \n${error.stack}\n`);
            }
        });
    },


};

//the list of customers whose accounts must be blocked
const getCustomerAccountToBlocked = async (datas: any[]) => {
    let transactionExcedeed: any[] = [];
    const template = await templatesCollection.getTemplateBy({ key: 'transactionOutsideNotJustified' });

    for (const data of datas) {
        const firsDate = Math.min(...data?.transactions?.map(elt => elt?.date));
        const transaction = data.transactions.find(elt => elt?.date === firsDate);

        const dateDiffInDays = moment().diff(moment(firsDate), 'days');

        if (dateDiffInDays > +template?.period) { transactionExcedeed.push(transaction) } else { continue }
    }

    return transactionExcedeed || [];
}

