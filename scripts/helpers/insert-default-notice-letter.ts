import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';

export const inserDefaultLetter = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS NOTICE LETTER');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const noticeLetters = {
        pdf: {
            fr: {
                headLeftText: "BICEC//Avenue du Général De Gaulle//Douala - Bonanjo//(+237) 233 43 60 00//contact@bicec.com",

                headRightText: "{{NOM_CLIENT}}//{{EMAIL_CLIENT}}//{{TELEPHONE_CLIENT}} //Fait à Douala le {{DATE_COURANTE_LONG}}",

                letterRef: "",

                objectText: "Mise en demeure pour non-production des justificatifs de la réalité de votre déplacement après utilisation de votre carte bancaire hors de la zone CEMAC",

                salutationText: "Monsieur/Madame,",

                introductionText: "Nous vous informons que dans le cadre de votre voyage hors CEMAC, vous avez effectué des transactions avec votre carte bancaire sans fournir des justificatifs de déplacement hors CEMAC à priori ou à postériori la BICEC.",

                bodyText: "En effet, il ressort de la lecture combinée de l’article 77 du Règlement N°2/02/18/CEMAC/UMAC/CM portant réglementation des changes, de l’instruction n° 008/GR/2019 de la BEAC et de la circulaire n°004/GR/2022 de la BEAC relatifs aux conditions et modalités d’utilisation à l’extérieur des instruments de paiement électronique, que l’utilisation desdits instruments à l’extérieur de la CEMAC est soumise à la transmission des documents de voyage y afférents",

                conclusionText: "Afin de satisfaire aux exigences légales prévues par la règlementation suscitée, nous vous prions de bien vouloir nous fournir les justificatifs dans un délai de huit (08) jours à compter de la date de réception de la présente lettre.",

                footerText: "Avenue du Général De Gaulle, (237) 233 43 12 26,  contact@bicec.com",

                signatureText: "BICEC",
            },
            en: {

                headLeftText: "BICEC//Avenue du Général De Gaulle//Douala - Bonanjo//(+237) 233 43 60 00//contact@bicec.com",

                headRightText: "{{NOM_CLIENT}}//{{EMAIL_CLIENT}}//{{TELEPHONE_CLIENT}}//Douala, {{DATE_COURANTE_LONG}}",

                letterRef: "",

                objectText: "Formal notice for failure to produce proof of the reality of your trip after using the card outside the CEMAC zone",

                salutationText: " Mr./Mrs",

                introductionText: "We inform you that during your trip outside CEMAC, you have made transactions with your bank card without providing proof of travel outside CEMAC a priori or a posteriori BICEC.",

                bodyText: "Indeed, it emerges from the combined reading of Article 77 of Regulation No. 2/02/18/CEMAC/UMAC/CM on exchange regulations, Instruction No. 008/GR/2019 of the BEAC and Circular No. 004/GR/2022 of the BEAC relating to the terms and conditions of external use of electronic payment instruments, that the use of such instruments outside CEMAC is subject to the transmission of the related travel documents.",

                conclusionText: "In order to comply with the legal requirements set out in the aforementioned regulations, we kindly ask you to provide us with the supporting documents within eight (08) days of the date of receipt of this letter.",

                footerText: "Avenue du Général De Gaulle, (237) 233 43 12 26,  contact@bicec.com",

                signatureText: "BICEC"
            },
            signature: ""
        },
        emailText: {
            fr: {
                mail: `
                Nous espérons que ce message vous trouve en bonne santé.////
                Nous vous écrivons ce mail, parce-que nous avons constaté la non-production de la preuve de votre voyage à l'étranger, dans le délai de 30 jours à compter de la date du {{DATE}}, date de réalisation de votre première opération avec votre carte bancaire {{CARTE}} en {{PAYS}} durant votre voyage hors CEMAC.////
                En conséquence, nous sommes dans l'obligation de vous adresser une mise en demeure. Vous trouverez cette lettre en pièce jointe à ce mail.////
                Nous vous prions de bien vouloir nous faire parvenir les dites pièces justificatives dans un délai de 08 jours. Faute de quoi vos instruments de paiement électronique seront suspendu pour utilisation hors CEMAC.////
                Vous pouvez le faire grâce à notre application disponible sur https://fly-banking.bicec.com, également en vous rapprochant de l'agence BICEC la plus proche.////
                Nous vous remercions de votre compréhension et votre coopération.//////
                Cordialement`
                ,
                obj: "Lettre de mise en demeure",
            },
            en: {
                mail: `
                We hope that this message finds you in good health.////
                We are writing you this email because we have noted that you have not produced proof of your trip abroad within 30 days of {{DATE}}, the date on which you made your first transaction with your bank card {{CARTE}} in {{PAYS}} during your trip outside the CEMAC.////
                As a result, we are obliged to send you a formal notice. You will find this letter attached to this email.////
                We kindly ask you to send us the said supporting documents within 08 days. Otherwise your electronic payment instruments will be suspended for use outside CEMAC.////
                You can do it thanks to our application available on https://fly-banking.bicec.com, also by approaching the nearest BICEC branch.////
                Thank you for your understanding and cooperation.//////
                Regards`,
                obj: "Formal notice letter",
            },
            // "Nous vous envoyons ce mail afin de notifier de la mise en demeure qui par rapport votre voyage qui demeure non justifié à ce jour.// Vous trouverez en annexe une copie de la lettre de mise en demeure."
        },
        smsText: {
            fr: {
                sms: "Chers Client,// Nous avons constaté la non-production de la preuve de votre voyage à l'étranger, dû à la transaction effectuée le {{DATE}} en {{PAYS}}. //En conséquence, nous sommes dans l'obligation de vous adresser une lettre mise en demeure, que vous recevrez par mail.// Vous pouvez le faire grâce à notre application disponible sur https://fly-banking.bicec.com, également en vous rapprochant de l'agence BICEC la plus proche.",
            },
            en: {
                sms: "Dear Customer,// We have noted the non-production of proof of your trip abroad, due to the transaction carried out on {{DATE}} in {{PAYS}}. // As a result, we are obliged to send you a letter of formal notice, which you will receive by e-mail.// You can do this using our application available at https://fly-banking.bicec.com, or by contacting your nearest BICEC branch.",
            },
        },
        period: 30
    }

    console.log('insert default notice letter into visa_operations_letters collection');

    const collectionsExists = await db.listCollections({ name: 'visa_operations_letters' }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name);

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("visa_operations_letters").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('visa_operations_letters').insertOne(noticeLetters);
    console.log(response.insertedId);
};