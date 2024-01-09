import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';

export const insertDefaultTemplateSetting = async () => {

    console.log('----------------------------------------');
    console.log('-------  INSERT DEFAULTS TEMPLATES ------');
    console.log('----------------------------------------');

    const db = await getDatabase();

    const templates = [
        {
            templateType: 200,
            key: 'ceilingOverrun',
            label: 'Dépassement de plafond sur les transactions Hors zone CEMAC',
            desc: 'Mail de Dépassement de plafond sur les transactions hors zone CEMAC',
            fr: {
                email: `
                Nous tenons à vous informer que le montant total ({{MONTANT}} XAF) des opérations hors zone CEMAC que vous avez effectués le mois de {{MOIS_DEPART}} a dépassé le plafond autorisé par la BEAC qui est de{{PLAFOND}} XAF.////
                Nous vous prions à cet effet de nous transmettre les details de vos dépenses avec leurs justificatifs dans un délai maximum de 30 jours à compter du {{DATE}} comme le précise la circulaire BEAC n°004/GR/2022.////
                Vous pouvez le faire à distance en vous connectant à la plateforme digitale FLY BANKING  : via le lien fly-banking@bicec.com //////
                Nous vous remercions pour votre fidélité.`,

                sms: `Bonjour,// Nous vous informons que vos operations hors zone CEMAC du mois de {{MOIS_DEPART}} ({{MONTANT}} XAF) ont depasse le plafond de {{PLAFOND}} XAF.// Merci de nous transmettre vos justificatifs sous 30 jours a compter du {{DATE}} via la plateforme FLY BANKING.// Merci pour votre fidélite.`,
                obj: `Dépassement de plafond sur les transactions Hors zone CEMAC`,
            },

            en: {
                email: `
                We would like to inform you that the total amount ({{MONTANT}} XAF) of transactions outside the CEMAC zone that you carried out in the month of {{MOIS_DEPART}} has exceeded the ceiling authorized by BEAC, which is {{PLAFOND}}. XAF.////
                We therefore ask you to send us the details of your expenses with supporting documents within a maximum of 30 days from {{DATE}} as specified in circular BEAC n°004/GR/2022.////
                You can do this remotely by connecting to the FLY BANKING digital platform: via the link fly-banking@bicec.com //////
                Thank you for your loyalty.`,

                sms: `We inform you that your operations outside the CEMAC zone for the month of {{MOIS_DEPART}} ({{MONTANT}} XAF) have exceeded the ceiling of {{PLAFOND}} XAF.// Please send us your receipts within 30 days from {{DATE}} via the FLY BANKING  platform.// Thank you for your loyalty.`,
                obj: `Transaction limits exceeded outside CEMAC zone`
            },
            sendType: 200,
            enabled: true,
            period: 0,
            dates: {
                created: new Date().valueOf(),
            }
        },

        {
            templateType: 200,
            key: 'firstTransaction',
            label: 'Première transaction hors zone CEMAC détectée',
            desc: 'Mail de première transaction hors zone CEMAC détectée',
            fr: {
                email: `
                Nous vous informons que vous avez effectué une transaction hors zone CEMAC.////
                À cet effet, nous vous prions de nous transmettre les  de votre voyage hors zone un délai maximum de 30 jours à compter du {{DATE}} comme le précise là  N004/GR/2022. //// 
                Vous pouvez le faire à distance en vous connectant à la plateforme digitale FLY BANKING : via le lien fly-banking@bicec.com //////
                Nous vous remercions pour votre. fidélité.`,

                sms: `Bonjour,// nous avons detectee une transaction hors zone CEMAC et nous vous prions a cet effet de nous transmettre vos justificatifs sous 30 jours a compter du {{DATE}} via la plateforme digitale FLY BANKING.// Nous vous remercions pour votre fidelite.`,
                obj: `Détection d'une transaction Hors zone CEMAC`
            },
            en: {
                email: `
                We would like to inform you that you have made a transaction outside the CEMAC zone.////
                To this end, we would ask you to send us the details of your out-of-zone trip a maximum of maximum of 30 days from {{DATE}} as specified in N004/GR/2022.////
                You can do this remotely by connecting to the FLY BANKING  digital platform: via the link fly-banking@bicec.com //////
                Thank you for your loyalty.`,

                sms: `Hello,// we have detected a transaction outside the CEMAC zone.// Please provide us with your proof within 30 days from {{DATE}} via FLY BANKING `,
                obj: `Detection of frist transaction outside the CEMAC zone`
            },
            sendType: 200,
            enabled: true,
            period: 0,
            dates: {
                created: new Date().valueOf(),
            }
        },

        {
            templateType: 200,
            key: 'transactionOutsideNotJustified',
            label: 'Blocage de votre carte bancaire',
            desc: 'Notification transactions hors zone CEMAC non justifiée',
            fr: {
                email: `
                Nous avons remarqué des transactions non justifiées dans les délais sur votre compte bancaire. Comme le précise la circulaire BEAC N004/GR/2022 nous avons l'obligation de bloquer votre carte bancaire.////
                Nous vous invitons à contacter notre service clientèle dès que possible pour discuter de ce sujet afin de trouver une solution.////
                Nous sommes désolés pour les désagréments que cela pourrait causer et nous espérons que nous pourrions résoudre ce problème rapidement.//////
                Cordialement`,

                sms: `Cher client,// nous sommes contraints de bloquer votre carte bancaire au vu des transactions non justifiees dans les delais.// Rapprocher de votre agence pour plus d'informations`,
                obj: `Notification de blocage de carte bancaire`

            },
            en: {
                email: `
                We have noticed some unjustified transactions on your bank account. As specified in BEAC circular N004/GR/2022 we are obliged to block your bank card.////
                We invite you to contact our customer service department as soon as possible to discuss this matter and find a solution.////
                We apologize for any inconvenience this may cause and hope that we can resolve this issue quickly.//////
                regards`,
                sms: `Dear customer,// we are obliged to block your credit card in view of the unjustified transactions within the time limit.// Please contact us to discuss`,
                obj: `Bank card block notification`
            },
            sendType: 200,
            period: 38,
            enabled: true,
            dates: {
                created: new Date().valueOf(),
            }
        }
    ]

    console.log('Insert default Templates  collection');

    const collectionsExists = await db.listCollections({ name: 'visa_operations_templates' }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name);

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("visa_operations_templates").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('visa_operations_templates').insertMany(templates);
    console.log(response.insertedIds);
};


