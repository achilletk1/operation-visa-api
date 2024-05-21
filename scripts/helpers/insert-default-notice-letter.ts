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

                letterRef: "N/Réf: RG/MD/DBD/032023",

                objectText: "Mise en demeure",

                salutationText: "Monsieur/Madame,",

                introductionText: "",

                bodyText: "Conformément à la règlementation de change 02/18/CEMAC/UMAC/CM et les circulaires subséquentes relatives qui précisent les conditions et modalités d'utilisation à l'extérieur des instruments de paiement électronique ainsi que le règlement à distance des transactions, nous avons le regret de constater que les pièces justificatives en liaison avec les opérations à distances effectuées par vos soins n'ont pas été transmises à votre agence BICEC.",

                conclusionText: "En conséquence, nous vous mettons en demeure de produire toutes les pièces justificatives liées à ces opérations à distance.//Sans réponse de votre part dans un délai de huit (08) jours dès réception de la présente, nous nous verrons contraints de suspendre l'utilisation de tous vos instruments de paiement électronique conséquemment aux dispositions de la règlementation précédemment citée.////Veuillez agréer, Madame, Monsieur, dans cet intervalle, l'expression de nos sentiments distingués.",

                footerText: "Avenue du Général De Gaulle, (237) 233 43 12 26,  contact@bicec.com",

                signatureText: "BICEC",
            },
            en: {

                headLeftText: "BICEC//Avenue du Général De Gaulle//Douala - Bonanjo//(+237) 233 43 60 00//contact@bicec.com",

                headRightText: "{{NOM_CLIENT}}//{{EMAIL_CLIENT}}//{{TELEPHONE_CLIENT}}//Douala, {{DATE_COURANTE_LONG}}",

                letterRef: "N/Réf: RG/MD/DBD/032023",

                objectText: "Formal notice",

                salutationText: " Mr./Mrs",

                introductionText: "",

                bodyText: "In accordance with the regulation of exchange 02/18/CEMAC/UMAC/CM and the relative subsequent circulars which specify the conditions and methods of use with the outside of the electronic instruments of payment as well as the remote payment of the transactions, we regret to note that the supporting documents in connection with the remote operations carried out by your care were not transmitted to your branch BICEC.",

                conclusionText: "As a result, we are giving you formal notice to produce all the supporting documents relating to these remote transactions.//Failing a response from you within eight (08) days of receipt of this letter, we shall be obliged to suspend the use of all your electronic payment instruments in accordance with the provisions of the aforementioned regulations.//// Please accept, Sir or Madam, the assurances of our highest consideration.",

                footerText: "Avenue du Général De Gaulle, (237) 233 43 12 26,  contact@bicec.com",

                signatureText: "BICEC"
            },
            signature: ""
        },
        emailText: {
            fr: {
                email: `
                Nous espérons que ce message vous trouve en bonne santé.////
                Nous vous écrivons ce mail, parce-que nous avons constaté la non-production de la preuve de votre voyage à l'étranger, dans le délai de 30 jours à compter de la date du {{DATE}}, date de réalisation de votre première opération avec votre carte bancaire {{CARTE}} en {{PAYS}} durant votre voyage hors CEMAC.////
                En conséquence, nous sommes dans l'obligation de vous adresser une mise en demeure. Vous trouverez cette lettre en pièce jointe à ce mail.////
                Nous vous prions de bien vouloir nous faire parvenir les dites pièces justificatives dans un délai de 08 jours. Faute de quoi vos instruments de paiement électronique seront suspendu pour utilisation hors CEMAC.////
                Vous pouvez le faire grâce à notre application disponible sur flybanking.bicec.com, également en vous rapprochant de l'agence BICEC la plus proche.////
                Nous vous remercions de votre compréhension et votre coopération.//////
                Cordialement`
                ,
                obj: "Mise en demeure"
            },
            en: {
                email: `
                We hope that this message finds you in good health.////
                We are writing you this email because we have noted that you have not produced proof of your trip abroad within 30 days of {{DATE}}, the date on which you made your first transaction with your bank card {{CARTE}} in {{PAYS}} during your trip outside the CEMAC.////
                As a result, we are obliged to send you a formal notice. You will find this letter attached to this email.////
                We kindly ask you to send us the said supporting documents within 08 days. Otherwise your electronic payment instruments will be suspended for use outside CEMAC.////
                You can do it thanks to our application available on flybanking.bicec.com, also by approaching the nearest BICEC branch.////
                Thank you for your understanding and cooperation.//////
                Regards`,
                obj: "Formal notice"
            }
            // "Nous vous envoyons ce mail afin de notifier de la mise en demeure qui par rapport votre voyage qui demeure non justifié à ce jour.// Vous trouverez en annexe une copie de la lettre de mise en demeure."
        },
        smsText: {
            fr: {
                sms: "Chers Client,// Nous avons constaté la non-production de la preuve de votre voyage à l'étranger, dû à la transaction effectuée le {{DATE}} en {{PAYS}}. //En conséquence, nous sommes dans l'obligation de vous adresser une lettre mise en demeure, que vous recevrez par mail.// Vous pouvez le faire grâce à notre application disponible sur flybanking.bicec.com, également en vous rapprochant de l'agence BICEC la plus proche."
            },
            en: {
                sms: "Dear Customer,// We have noted the non-production of proof of your trip abroad, due to the transaction carried out on {{DATE}} in {{PAYS}}. // As a result, we are obliged to send you a letter of formal notice, which you will receive by e-mail.// You can do this using our application available at flybanking.bicec.com, or by contacting your nearest BICEC branch."
            }
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