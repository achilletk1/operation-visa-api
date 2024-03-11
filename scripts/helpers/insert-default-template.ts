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
                Nous tenons à vous informer que le montant total ({{MONTANT}} XAF) des opérations hors zone CEMAC que vous avez effectués le mois de {{MOIS_DEPART}} a dépassé le plafond autorisé par la BEAC qui est de{{PLAFOND}} XAF.////\n
                Nous vous prions à cet effet de nous transmettre les details de vos dépenses avec leurs justificatifs dans un délai maximum de 30 jours à compter du {{DATE}} comme le précise la circulaire BEAC n°004/GR/2022.////\n
                Vous pouvez le faire à distance en vous connectant à la plateforme digitale FLY BANKING  : via le lien {{APP_LINK}} //////\n
                Nous vous remercions pour votre fidélité.`,

                sms: "Chère client,// vos opérations de {{MOIS_DEPART}} de {{MONTANT}} XAF depasse la limite autorisé, veuillez nous fournir vos justificatifs avant le {{DATELINE}}via le lien {{APP_LINK}}. Merci pour votre fidélité.",
                obj: "Dépassement de plafond sur les transactions Hors zone CEMAC",
            },

            en: {
                email: `
                We would like to inform you that the total amount ({{MONTANT}} XAF) of transactions outside the CEMAC zone that you carried out during the month of {{MOIS_DEPART}} has exceeded the ceiling authorised by the BEAC, which is {{PLAFOND}} XAF.////\n
                We would therefore ask you to send us details of your expenditure with supporting documents within a maximum of 30 days from {{DATE}} as specified in BEAC circular n°004/GR/2022.////.\n
                You can do this remotely by connecting to the FLY BANKING digital platform: via the link {{APP_LINK}} //////\n
                Thank you for your loyalty.`,

                sms: "Dear customer,// your {{MOIS_DEPART}} transactions of {{MONTANT}} XAF exceeds the authorised limit, please provide us with your supporting documents before {{DATELINE}} via the {{APP_LINK}} link. Thank you for your loyalty.",
                obj: "Transaction limits exceeded outside CEMAC zone"
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
                Vous avez effectué une transaction hors zone CEMAC avec votre carte {{PRODUIT}} le {{DATE}}.////
                Conformément à la réglémentation de change de la CEMAC (N°2/02/18/CEMAC/UMAC/CM), nous vous prions de nous fournir les justificatifs de votre voyage hors zone CEMAC avant le {{DATELINE}}.////
                Vous pouvez le faire à distance en vous connectant à la plateforme digitale FLY BANKING : via le lien {{APP_LINK}} //////
                Pour toutes questions contacter votre gestionnaire client.`,

                sms: "Cher client, vous avez effectué une transaction hors zone CEMAC avec votre carte {{PRODUIT}} le {{DATE}}. Veuillez fournir les justificatifs avant le {{DEADLINE}} via le lien {{APP_LINK}}. Merci de votre fidelite.",
                obj: "Détection d'une transaction Hors zone CEMAC"
            },
            en: {
                email: `
                You made a transaction outside the CEMAC zone with your {{PRODUIT}} card on {{DATE}}.////
                In accordance with CEMAC exchange regulations (N°2/02/18/CEMAC/UMAC/CM), please provide us with proof of your trip outside the CEMAC zone before {{DATELINE}}.////
                You can do this remotely by connecting to the FLY BANKING digital platform: via the link {{APP_LINK}} //////
                If you have any questions, please contact your customer manager.`,

                sms: "Dear customer, you made a transaction outside the CEMAC zone with your {{PRODUIT}} card on {{DATE}}. Please provide the supporting documents before {{DEADLINE}} via the {{APP_LINK}} link. Thank you for your loyalty.",
                obj: "Detection of frist transaction outside the CEMAC zone"
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
                Nous avons remarqué des transactions non justifiées dans les délais sur votre compte bancaire.////
                Comme le précise la circulaire BEAC N004/GR/2022 nous sommes au regret  de vous informer du bloquage, en dehors de la zone CEMAC, de tous vos instruments de paiement électronique.////
                Nous vous prions à cet effet de nous transmettre les details de vos dépenses avec leurs justificatifs.////
                Veuillez vous rapprocher de votre gestionnaire pour plus de détails.`,

                sms: "Cher client, nous sommes au regret de vous informer du bloquage hors de la zone CEMAC de tous vos instruments de paiement conformement à la reglement des changes en vigeur, Veuillez vous rapprocher de votre gestionnaire pour plus de détails.",
                obj: "Notification de blocage de carte bancaire"

            },
            en: {
                email: `
                We have noticed unjustified transactions on your bank account on time.////
                As specified in BEAC circular N004/GR/2022, we regret to inform you that all your electronic payment instruments are blocked outside the CEMAC zone.////
                We would therefore ask you to send us details of your expenses with supporting documents.////
                Please contact your manager for further details.`,
                sms: "Dear customer, we regret to inform you that all your payment instruments have been blocked outside the CEMAC zone in accordance with current exchange regulations. Please contact your manager for further details.",
                obj: "Bank card block notification"
            },
            sendType: 200,
            period: 38,
            enabled: true,
            dates: {
                created: new Date().valueOf(),
            }
        },
        {
            templateType: 200,
            key: 'remindTransactionNotJustifiedAfterShortTime',
            label: 'Première relance de justificatifs en attente pour opérations sur carte hors CEMAC',
            desc: 'Notification de première relance pour des transactions hors zone CEMAC non justifiée',
            fr: {
                email: `
                Nous avons remarqué des transactions hors CEMAC sur vos cartes bancaires BICEC, vous devez nous fournir les justificatifs des dites opérations dans un délai maximum de 30 jours à compter du {{DATE}}. Comme le précise la circulaire BEAC N004/GR/2022.////
                Nous vous invitons à contacter notre service clientèle dès que possible pour avoir plus d'informations et de détails sur la procédure à suivre.////
                Vous pouvez le faire à distance en vous connectant à la plateforme digitale FLY BANKING : via le lien fly-banking@bicec.com //////
                Nous vous remercions pour votre fidélité.`,

                sms: "Cher client,// nous constatons que vous n'avez toujours pas fourni les justificatifs liés à vos opérations hors CEMAC sur la carte {{CARTE}}, nous vous prions de nous les transmettre sous peine de blocage de carte dans les bref délai.// Rapprochez-vous de votre agence pour plus d'informations",
                obj: "Première relance de justificatifs en attente pour opérations sur carte hors CEMAC"

            },
            en: {
                email: `
                We have noticed transactions outside CEMAC on your BICEC bank cards. You must provide us with proof of these transactions within a maximum period of 30 days from {{DATE}}. As stated in BEAC circular N004/GR/2022.////
                We invite you to contact our customer service department as soon as possible for more information and details of the procedure to be followed.////
                You can do this remotely by connecting to the FLY BANKING digital platform: via the link fly-banking@bicec.com //////
                Thank you for your loyalty.`,
                sms: "Dear customer,// we note that you have still not provided us with the supporting documents relating to your transactions outside CEMAC on the {{CARTE}} card. Please send them to us, otherwise your card will be blocked as soon as possible.// Please contact your branch for more information.",
                obj: "First reminder of outstanding supporting documents for card transactions outside the CEMAC region"
            },
            sendType: 200,
            period: 15,
            enabled: true,
            dates: {
                created: new Date().valueOf(),
            }
        },
        {
            templateType: 200,
            key: 'remindTransactionNotJustifiedAfterLongTime',
            label: 'Deuxième relance de justificatifs en attente pour opérations sur carte hors CEMAC',
            desc: 'Notification de deuxième relance pour des transactions hors zone CEMAC non justifiée',
            fr: {
                email: `
                Nous avons remarqué des transactions hors CEMAC sur vos cartes bancaires BICEC, vous devez nous fournir les justificatifs des dites opérations dans un délai maximum de 30 jours à compter du {{DATE}}. Comme le précise la circulaire BEAC N004/GR/2022.////
                Nous vous invitons à contacter notre service clientèle dès que possible pour avoir plus d'informations et de détails sur la procédure à suivre.////
                Afin d'éviter que nous soyons contraint à bloquer votre carte ! ////
                Vous pouvez le faire à distance en vous connectant à la plateforme digitale FLY BANKING : via le lien fly-banking@bicec.com //////
                Nous vous remercions pour votre fidélité.`,

                sms: "Cher client,// nous constatons que vous n'avez toujours pas fourni les justificatifs liés à vos opérations hors CEMAC sur la carte {{CARTE}}, nous vous prions de nous les transmettre sous peine de blocage de carte dans les bref délai.// Rapprochez-vous de votre agence pour plus d'informations",
                obj: "Deuxième relance de justificatifs en attente pour opérations sur carte hors CEMAC"

            },
            en: {
                email: `
                We have noticed transactions outside CEMAC on your BICEC bank cards. You must provide us with proof of these transactions within a maximum period of 30 days from {{DATE}}. As stated in BEAC circular N004/GR/2022.////
                We invite you to contact our customer service department as soon as possible for further information and details of the procedure to be followed.////
                To avoid us having to block your card! ////
                You can do this remotely by connecting to the FLY BANKING digital platform: via the link fly-banking@bicec.com //////
                Thank you for your loyalty.`,
                sms: "Dear customer,// we note that you have still not provided the supporting documents relating to your transactions outside CEMAC on the {{CARTE}} card. Please send them to us or your card will be blocked as soon as possible.// Please contact your branch for more information.",
                obj: "Second reminder of pending supporting documents for card transactions outside the CEMAC region"
            },
            sendType: 200,
            period: 25,
            enabled: true,
            dates: {
                created: new Date().valueOf(),
            }
        },
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


