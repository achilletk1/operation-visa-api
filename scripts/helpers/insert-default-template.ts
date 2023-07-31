import moment from 'moment'
import { getDatabase } from '../config';

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
            email: {
                french: `Nous tenons à vous informer que le montant total ({{AMOUNT}}) des opérations hors
                zone CEMAC que vous avez effectués le
                {{START}} a
                dépassé le plafond autorisé par la
                BEAC qui est de
                {{CEILLING}}.
                //
                //Nous vous
                prions à cet effet de nous transmettre les
                details de vos dépenses avec leurs justificatifs
                dans un délai
                maximum de 30 jours à compter du
                {{SYSTEM_TODAY_SHORT}} comme le précise la
                circulaireBEAC
                    N004/G4/2002. Vous pouvez le faire à distance en vous
                    connectant
                    à
                    la plateforme digitale BCIONLINE : via le
                    lien //
                 Nous
                vous remercions pour votre fidélité.
                
                Aller à
                        l'application`,
                english: `We would like to inform you that the total amount ({{AMOUNT}}) of transactions outside the
                CEMAC zone that you carried out on
                {{START}} has
                exceeded the
                BEAC which is
                {{CEILLING}}.
                //
                //We
                please send us details of your expenses
                details of your expenses with supporting documents
                within
                maximum of 30 days from
               {{SYSTEM_TODAY_SHORT}} as specified in the
                circularBEAC
                    N004/G4/2002. You can do this remotely by
                    connecting
                    à
                    the BCIONLINE digital platform: via the
                    link //
                 We
                thank you for your loyalty.`
            },
            sms: {
                french: `Chèr(e) client(e) nous tenons à vous informer que le montant total ({{AMOUNT}}) des opérations hors
                zone CEMAC que vous avez effectués le
                {{START}} a
                dépassé le plafond autorisé par la
                BEAC qui est de
                {{CEILLING}}.
                //
                //Nous vous
                prions à cet effet de nous transmettre les
                details de vos dépenses avec leurs justificatifs
                dans un délai
                maximum de 30 jours à compter du
               {{SYSTEM_TODAY_SHORT}} comme le précise la
                circulaireBEAC
                    N004/G4/2002. Vous pouvez le faire à distance en vous
                    connectant
                    à
                    la plateforme digitale BCIONLINE : via le
                    lien //`,
                english: `Dear customer, we would like to inform you that the total amount ({{AMOUNT}}) of transactions outside the
                CEMAC zone that you carried out on
                {{START}} has
                exceeded the
                BEAC which is
                {{CEILLING}}.
                //
                //We
                please send us details of your expenses
                details of your expenses with supporting documents
                within
                maximum of 30 days from
               {{SYSTEM_TODAY_SHORT}} as specified in the
                circularBEAC
                    N004/G4/2002. You can do this remotely by
                    connecting
                    à
                    the BCIONLINE digital platform: via the
                    link //`
            },
            obj: {
                french: `Dépassement de plafond sur les transactions Hors zone CEMAC`,
                english: `Transaction limits exceeded outside CEMAC zone`
            },
            sendType: 200,
            enabled: true,
            period: 'J+0',
            date: {
                created: moment().valueOf(),
                updated: 0
            }
        },

        {
            templateType: 200,
            key: 'firstTransaction',
            label: 'Première  transaction hors zone CEMAC détectée',
            desc: 'Mail de première  transaction hors zone CEMAC détectée',
            email: {
                french: `Bonjour, // 
                Nous vous informons que vous venez d’effectuer une transaction hors zone CEMAC.//
                 Cette transaction a été détectée et nous vous
                prions à cet effet de nous transmettre les
                preuves de votre voyage hors zone cemac
                dans un délai
                maximum de 30 jours à compter du
               {{SYSTEM_TODAY_SHORT}} comme le précise la
                circulaire BEAC
                    N004/G4/2002. Vous pouvez le faire à distance en vous
                    connectant
                    à
                    la plateforme digitale BCIONLINE : via le
                    lien //
                 Nous
                vous remercions pour votre fidélité.
                
                Aller à l'application`,
                english: `Hello, // 
                We would like to inform you that you have just carried out a transaction outside the CEMAC zone.
                 This transaction has been detected and we
                please send us the details of your expenses
                details of your expenses with supporting documents
                within
                maximum of 30 days from
               {{SYSTEM_TODAY_SHORT}} as specified in the
                BEAC circular
                    N004/G4/2002. You can do this remotely by
                    connecting
                    à
                    the BCIONLINE digital platform: via the
                    link //
                 We
                thank you for your loyalty.                
                Go to  the application`
            },
            sms: {
                french: `Chèr(e) "NOM" Nous vous informons que nous avons  détectée uen transaction hors zone CEMAC et nous vous
               prions à cet effet de nous transmettre les
               details de vos dépenses avec leurs justificatifs
               dans un délai  maximum de 30 jours à compter du
              {{SYSTEM_TODAY_SHORT}} comme le précise la circulaire BEAC N004/G4/2002. Vous pouvez le faire à distance en vous
                connectant à  la plateforme digitale BCIONLINE : via le lien //
                Nous vous remercions pour votre fidélité.`,
                english: `Dear Customer We would like to inform you that we have detected a transaction outside the CEMAC zone.
                please send us the details of your expenses
                details of your expenses with supporting documents
                within a maximum of 30 days from
               {{SYSTEM_TODAY_SHORT}} as specified in BEAC circular N004/G4/2002. You can do this remotely by
                 connecting to the BCIONLINE digital platform: via the link //.
                 Thank you for your loyalty.`
            },
            obj: {
                french: `Détection d'une transaction  Hors zone CEMAC`,
                english: `Detection of a transaction outside the CEMAC zone`
            },
            sendType: 200,
            enabled: true,
            period: 'J+0',
            date: {
                created: moment().valueOf(),
                updated: 0
            }
        },

        {
            templateType: 200,
            key: 'transactionOutsideNotJustified',
            label: 'Blocage de  votre carte bancaire',
            desc: 'Notification transactions hors zone CEMAC non justifiée',
            email: {
                french: `
                Cher(e) {{NAME}} ,        
                Nous avons remarqué des transactions non justifiées sur votre compte bancaire.comme le précise la
                circulaire BEAC
                    N004/G4/2002  nous avons l'obligation de bloquer votre carte bancaire.
                Nous vous invitons à contacter notre service clientèle dès que possible pour discuter de ce sujet afin de trouver une solution. 
                Nous sommes désolés pour les désagréments que cela pourrait causer et nous espérons que nous pourrions résoudre ce problème rapidement.
                
                Aller à l'application`,
                english: `Dear {{NAME}} ,        
                We have noticed unjustified transactions on your bank account. As specified in the
                BEAC circular
                    N004/G4/2002 we are obliged to block your bank card.
                We invite you to contact our customer service as soon as possible to discuss this matter and find a solution. 
                We apologize for any inconvenience this may cause and hope that we can resolve this issue quickly.              
                Go to  the application`
            },
            sms: {
                french: ` Cher(e) {{NAME}} ,        
                Nous avons remarqué des transactions non justifiées sur votre compte bancaire.comme le précise la
                circulaire BEAC
                    N004/G4/2002  nous avons l'obligation de bloquer votre carte bancaire.
                Nous vous invitons à contacter notre service clientèle dès que possible pour discuter de ce sujet afin de trouver une solution. 
                Nous sommes désolés pour les désagréments que cela pourrait causer et nous espérons que nous pourrions résoudre ce problème rapidement.
                `,
                english: `Dear {{NAME}} ,        
                We have noticed unjustified transactions on your bank account. As specified in the
                BEAC circular
                    N004/G4/2002 we are obliged to block your bank card.
                We invite you to contact our customer service as soon as possible to discuss this matter and find a solution. 
                We apologize for any inconvenience this may cause and hope that we can resolve this issue quickly.`
            },
            obj: {
                french: `Notification de blocage de carte bancaire`,
                english: `Bank card block notification`
            },
            sendType: 200,
            period: 'J+38',
            enabled: true,
            date: {
                created: moment().valueOf(),
                updated: 0
            }
        },



    ]
    console.log('Insert default Templates  collection');
    db.dropCollection("visa_operations_templates", function (err, result) { console.log("Collection droped"); });
    const response = await db.collection('visa_operations_templates').insertMany(templates);
    console.log(response.insertedIds);
};


