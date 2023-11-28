import { getDatabase } from 'database/mongodb';
import { isEmpty } from 'lodash';

export const inserDefaultLetter = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS NOTICE LETTER');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const noticeLetters = {
        "pdf": {
            "fr": {
                "headLeftText": "BCI Congo//BP: 147 Congo brazzaville//242 718 22 87//contact@bcicongo.com",

                "headRightText": "{{NOM_CLIENT}}//{{EMAIL_CLIENT}}//{{TELEPHONE_CLIENT}} //Fait à Brazaville le {{DATE_COURANTE_LONG}}",

                "letterRef": "",

                "objectText": "Mise en demeure pour non-production des justificatifs de la réalité de votre déplacement après utilisation de votre carte bancaire hors de la zone CEMAC",

                "salutationText": "Monsieur/Madame,",

                "introductionText": "Nous vous informons que dans le cadre de vos transactions par cartes bancaires, vous avez effectué des transactions hors de la zone CEMAC sans en notifier à priori ou à postériori la BCI.",

                "bodyText": "En effet, il ressort de la lecture combinée de l’article 77 du Règlement N°2/02/18/CEMAC/UMAC/CM portant réglementation des changes, de l’instruction n° 008/GR/2019 de la BEAC et de la circulaire n°004/GR/2022 de la BEAC relatifs aux conditions et modalités d’utilisation à l’extérieur des instruments de paiement électronique, que l’utilisation desdits instruments à l’extérieur de la CEMAC est soumise à la transmission des documents de voyage y afférents",

                "conclusionText": "Afin de satisfaire aux exigences légales prévues par la règlementation suscitée, nous vous prions de bien vouloir nous fournir les justificatifs dans un délai de huit (08) jours à compter de la date de réception de la présente lettre.",

                "signatureText": "BCI CONGO",

                "footerText": "BP: 147 Congo brazzaville ,  242 718 22 87,  contact@bcicongo.com",
            },
            "en": {

                "headLeftText": "BCI Congo//P.O. Box: 147 Congo brazzaville//242 718 22 87",

                "headRightText": "{{NOM_CLIENT}}//{{EMAIL_CLIENT}}//{{TELEPHONE_CLIENT}}//Brazaville, {{DATE_COURANTE_LONG}}",

                "letterRef": "",

                "objectText": " Formal notice for failure to produce proof of the reality of your trip after using the card outside the CEMAC zone",

                "salutationText": " Mr./Mrs",

                "introductionText": "We inform you that as part of your credit card transactions, you have made transactions outside the CEMAC zone without notifying bci a priori or a posteriori.",

                "bodyText": "Indeed, it emerges from the combined reading of Article 77 of Regulation No. 2/02/18/CEMAC/UMAC/CM on exchange regulations, Instruction No. 008/GR/2019 of the BEAC and Circular No. 004/GR/2022 of the BEAC relating to the terms and conditions of external use of electronic payment instruments, that the use of such instruments outside CEMAC is subject to the transmission of the related travel documents.",

                "conclusionText": "In order to comply with the legal requirements set out in the aforementioned regulations, we kindly ask you to provide us with the supporting documents within eight (08) days of the date of receipt of this letter.",

                "footerText": "P.O. Box: 147 Congo brazzaville, 242 718 22 87, contact@bcicongo.com",

                "signatureText": "BCI CONGO"
            },
            "signature": ""
        },
        "emailText": {
            "en": "We are sending you this e-mail in relation to your trip, which remains unjustified to this day. You will find attached a copy of the letter of formal notice.",
            "fr": "Nous vous envoyons ce mail par rapport votre voyage qui demeure non justifié à ce jour. Vous trouverez en annexe une copie de la lettre de mise en demeure."
        },
        period: 30
    }

    console.log('insert default notice letter into visa_operations_letters collection');

    const collectionsExists = await db.listCollections({name: 'visa_operations_letters'}).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name);

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("visa_operations_letters").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('visa_operations_letters').insertOne(noticeLetters);
    console.log(response.insertedId);
};