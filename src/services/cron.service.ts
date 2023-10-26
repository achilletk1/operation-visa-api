import { VisaTransactonsProcessingService } from "./visa-transaction-processing.service";
import { onlinePaymentsCollection } from "../collections/online-payments.collection";
import { templatesCollection } from "../collections/templates.collection";
import { travelsCollection } from "../collections/travels.collection";
import { temporaryFilesService } from "./temporary-files.service";
import { onlinePaymentsService } from "./online-payment.service";
import { notificationService } from "./notification.service";
import { OpeVisaStatus } from "../models/visa-operations";
import { State } from "../class/statut";
import { logger } from "../winston";
import { config } from "../config";
import { isEmpty } from "lodash";
import cron from 'node-cron';
import moment from "moment";
let state: any;
let visaTransactonsProcessingService: VisaTransactonsProcessingService;
export const cronService = {
    instantiate: () => {
        state = new State();
        visaTransactonsProcessingService = new VisaTransactonsProcessingService()

    },

    // Regroupement des voyages et paiements en ligne ayant dépassé. 
    startTransactionsProcessing: async (): Promise<void> => {
        const cronExpression = `${config.get('cronTransactionProcessing')}`;

        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startTransactionsProcessing(state);
            } catch (error) {
                logger.error(`start transactions processing failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // Envois des lettres de mise en demeurre et des mails de blocage de carte
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

    // supprimé les fichiers temporaires
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

    // Supprimé les mois de paiement en ligne passé n'ayant pas dépassés le plafond sauf le mois courant
    startRemoveOnpWithoutExceeding: async (): Promise<void> => {
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

    // detecté les utilisateurs en situation de blocage de carte et faire un mail à la BCI avec la liste en copie.
    detectListOfUsersToBlocked: async (): Promise<void> => {
        cron.schedule(`${config.get('cronclientindemeure')}`, async () => {
            try {
                const travelsExcedeed: any[] = await travelsCollection.getTravelsBy({ status: { $in: [OpeVisaStatus.EXCEDEED] } });
                const onlinePaymentsExcedeed: any[] = await onlinePaymentsCollection.getOnlinePaymentsBy({ status: { $in: [OpeVisaStatus.EXCEDEED] } });
                let transactionsExcedeed: any = [];
                if (isEmpty([...travelsExcedeed, ...onlinePaymentsExcedeed])) return;
                transactionsExcedeed = await getCustomerAccountToBlocked([...travelsExcedeed, ...onlinePaymentsExcedeed]);

                if (!isEmpty(transactionsExcedeed)) {
                    await notificationService.sendEmailListOfUsersToBloqued(transactionsExcedeed)
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

