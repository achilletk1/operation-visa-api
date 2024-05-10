import { getDatabase } from '../../src/database/mongodb';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

export const inserDefaultVouchers = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS VOUCHERS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const vouchers = [
        {
            _id: new ObjectId('63187ce69bbd2f516303b171'),
            label: `Facture`,
            extension: '*',
            description: `Facture ou ticket de caisse`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187c8c9bbd2f516303b16e'),
            label: `Facture proforma`,
            extension: '*',
            description: `Facture proforma`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187c9c9bbd2f516303b16f'),
            label: `Preuve d'appels de fonds`,
            extension: '*',
            description: `Preuve d'appels de fonds en vue d'un paiement`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187d259bbd2f516303b172'),
            label: `Contrat`,
            extension: '*',
            description: `Contrat`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65534e1eb2ccd46cc6bdef08'),
            label: `Ordre de mission`,
            extension: '*',
            description: `Ordre de mission`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187ac69bbd2f516303b168'),
            label: `Certificat de scolarité`,
            extension: '*',
            description: `Certificat de scolarité`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187ad29bbd2f516303b169'),
            label: `Carte étudiant`,
            extension: '*',
            description: `Carte étudiant`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187af79bbd2f516303b16a'),
            label: 'Copie du passeport du bénéficiaire',
            extension: '*',
            description: 'Copie du passeport du bénéficiaire (élève, étudiant)',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187b439bbd2f516303b16b'),
            label: `Justificatif lien entre titulaire carte et bénéficiaire`,
            extension: '*',
            description: `Justification du lien entre le titulaire de l'instrument de paiement élèctronique et le bénéficiaire du paiement`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187bf09bbd2f516303b16c'),
            label: 'Facture/Document attestant prestation de santé sur résident CEMAC',
            extension: '*',
            description: "Les Factures ou tout document attestant de la prestation de santé en faveur d'un résidant de la CEMAC",
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('63187c1a9bbd2f516303b16d'),
            label: 'Preuve de voyage futur hors CEMAC',
            extension: '*',
            description: "Preuve de voyage futur à l'extérieur de la CEMAC",
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65535116b2ccd46cc6bdef09'),
            label: 'Carte de séjour en cours de validité',
            extension: '*',
            description: "Carte de séjour en cours de validité pour les risidents étrangers",
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('6553512cb2ccd46cc6bdef0b'),
            label: 'Tout document attestant le statut de non (visa, etc, ..)',
            extension: '*',
            description: "Tout document attestant le statut de non (visa, etc, ..) pour les non résidents",
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('631853085a430f5fac5c503d'),
            label: `Visa`,
            extension: '*',
            description: `Visa`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65534d5cb2ccd46cc6bdef07'),
            label: `Passeport`,
            extension: '*',
            description: `Passeport`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('655330adb2ccd46cc6bdef04'),
            label: `Tampon d'entrée du passesport`,
            extension: '*',
            description: `Cachet appliqué sur le passesport donnant autorisation d'entrée dans le térittoire de destination`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65533259b2ccd46cc6bdef05'),
            label: `Tampon de sortie du passesport`,
            extension: '*',
            description: `Cachet appliqué sur le passesport donnant autorisation de sortir de la zone CEMAC`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('631852ff5a430f5fac5c503c'),
            label: `Document de transport`,
            extension: '*',
            description: `Billet d'avion, Ticket de train, ticket de bus`,
            dates: { created: new Date().valueOf() }
        },


        //Pour tout type de transferts //
        {
            _id: new ObjectId('65e9c6c9a4a054e09764eff0'),
            label: `Ordre du client`,
            extension: '*',
            description: `Ordre du client avec adresse electronique date de moins de 15 jours ou demande d'ouverture de la lettre de credit ou remise documentaire`,
            dates: { created: new Date().valueOf() }
        },

        {
            _id: new ObjectId('65eea7b3a4a054e09764eff6'),
            label: ` Demande d'autorisation de transfert de la banque`,
            extension: '*',
            description: ` Demande d'autorisation de transfert de la banque`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65eea7b3a4a054e09764eff7'),
            label: `Preuve du paiement des impots`,
            extension: '*',
            description: `Preuve du paiement des impots`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65eea7b3a4a054e09764eff9'),
            label: "Attestation de Non Redevance (ANR)",
            extension: '*',
            description: `Attestation de Non Redevance (ANR) lorsque les dispositions fiscales du pays l'exigent`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65eea860a4a054e09764effa'),
            label: "Message SWIFT MTn98",
            extension: '*',
            description: `Message SWIFT MTn98`,
            dates: { created: new Date().valueOf() }
        },

        //Allocation de devises pour les operations de faiblcs mootaots. //
        {
            _id: new ObjectId('65eea93ba4a054e09764effb'),
            label: "Demande de la banque ",
            extension: '*',
            description: `Demande de la banque`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65eea93ba4a054e09764effc'),
            label: "MT298 ",
            extension: '*',
            description: `MT298`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65eea93ba4a054e09764effd'),
            label: "Tableau	previsionnel  des	engagements	de	paiement  a l'exterieur (DFX2230).",
            extension: '*',
            description: `Tableau	previsionnel  des	engagements	de	paiement  a l'exterieur (DFX2230). `,
            dates: { created: new Date().valueOf() }
        },
        //Achat de biens //

        {
            _id: new ObjectId('65eea93ba4a054e09764effe'),
            label: "Attestation de domiciliation",
            extension: '*',
            description: `Attestation de domiciliation dument signee avec cachet de la banque domiciliataire (si valeur > 5 millions)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65eea93ba4a054e09764efff'),
            label: "Facture pro forma, le cas echeant, datee de moins de 12 mois",
            extension: '*',
            description: `Facture pro forma, le cas echeant, datee de moins de 12 mois`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f340aa55fff21fd3f0843b'),
            label: "Facture definitive, le cas echeant, datee de moins de 12 mois",
            extension: '*',
            description: `Facture definitive, le cas echeant, datee de moins de 12 mois`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3713d55fff21fd3f08484'),
            label: "MT700",
            extension: '*',
            description: `MT700`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3716155fff21fd3f08485'),
            label: "MT707",
            extension: '*',
            description: `MT707`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3717255fff21fd3f08486'),
            label: "Contrat commercial,",
            extension: '*',
            description: `Contrat commercial,`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3718255fff21fd3f08487'),
            label: "Declaration d'importation aux autorites douanieres (DJ) ",
            extension: '*',
            description: `Declaration d'importation aux autorites douanieres (DJ)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3719955fff21fd3f08488'),
            label: "Autorisation pour les produits soumis a restriction ",
            extension: '*',
            description: `Autorisation pour les produits soumis a restriction`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371aa55fff21fd3f08489'),
            label: "declaration en detail fournie par la douane, ",
            extension: '*',
            description: `declaration en detail fournie par la douane,`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371b955fff21fd3f0848a'),
            label: "quittance de paiement des droits et taxes de douane ",
            extension: '*',
            description: `quittance de paiement des droits et taxes de douane`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371b955fff21fd3f0848b'),
            label: "connaissement",
            extension: '*',
            description: `connaissement`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371b955fff21fd3f0848c'),
            label: "LTA ",
            extension: '*',
            description: `LTA`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371b955fff21fd3f0848d'),
            label: "Lettre de voiture ",
            extension: '*',
            description: `Lettre de voiture`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371b955fff21fd3f0848e'),
            label: "Autre piece justificative ",
            extension: '*',
            description: `Tout autre piece justificative`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371b955fff21fd3f0848f'),
            label: "Etat recapitulatif",
            extension: '*',
            description: `Listant les dates et references des factures, les montants ainsi que, le cas ccheant, les numeros de declaration d'importation et d'attestation de domiciliation`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08490'),
            label: "Tout  document	permettant de determiner l'echeance de reglement",
            extension: '*',
            description: `Tout  document	permettant de determiner l'echeance de reglement`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08491'),
            label: "documents de transport de chaque expedition",
            extension: '*',
            description: `documents de transport de chaque expedition `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08492'),
            label: "preuve du debit en compte du montant du CREDOC",
            extension: '*',
            description: `preuve du debit en compte du montant du CREDOC `,
            dates: { created: new Date().valueOf() }
        },

        // Achat de services //
        {
            _id: new ObjectId('65f371fe55fff21fd3f08493'),
            label: "Contrat de service",
            extension: '*',
            description: `Contrat de service enregistre aupres de l'administration fiscale ou celle en tenant lieu `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08494'),
            label: "Preuve de l'effectivite du service,",
            extension: '*',
            description: `Preuve de l'effectivite du service,`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08495'),
            label: "Declaration d'importation de service",
            extension: '*',
            description: `Declaration d'importation de service a la Banque Centrale (modele annexe a l'instruction n° 007/GR/2019 du 10/06/2019)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08496'),
            label: "Preuve de reglement de l'impot ",
            extension: '*',
            description: `Preuve de reglement de l'impot `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08497'),
            label: "Note de debit",
            extension: '*',
            description: `Note de debit`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08498'),
            label: "Note de frais",
            extension: '*',
            description: `Note de frais`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f371fe55fff21fd3f08499'),
            label: "Note de d'honoraire ",
            extension: '*',
            description: `Note de d'honoraire `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3724d55fff21fd3f0849a'),
            label: "proces­ verbal de reception provisoire ou definitive  ",
            extension: '*',
            description: `proces­ verbal de reception provisoire ou definitive `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3724d55fff21fd3f0849b'),
            label: "rapport d'etudes",
            extension: '*',
            description: `rapport d'etudes`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3724d55fff21fd3f0849c'),
            label: "rapport d'etudes",
            extension: '*',
            description: `rapport d'etudes`,
            dates: { created: new Date().valueOf() }
        },

        //Frais d'assistance technique //
        {
            _id: new ObjectId('65f3724d55fff21fd3f0849d'),
            label: "Convention d'assistance technique dument enregistree aupres des autorites fiscales ",
            extension: '*',
            description: `Convention d'assistance technique dument enregistree aupres des autorites fiscales `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3724d55fff21fd3f0849e'),
            label: "Bilan  ",
            extension: '*',
            description: `Bilan `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3724d55fff21fd3f0849f'),
            label: "compte de resultat du donneur d'ordre sur la periode de reference  ",
            extension: '*',
            description: `compte de resultat du donneur d'ordre sur la periode de reference `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a0'),
            label: "Releve par nature de frais  ",
            extension: '*',
            description: `Releve par nature de frais (details et facturation de l'ensemble des prestations faisant l'objet du paiement a effecruer) `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a1'),
            label: "Releve de compte special  ",
            extension: '*',
            description: `Releve de compte special ouvert a cet effet dans les livres d'une banque de  la place retrçant l'ensemble des operations liees a l'assistance technique`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a2'),
            label: "Preuve de reglement de l'impot lie ou de l'exoneration",
            extension: '*',
            description: `Preuve de reglement de l'impot lie ou de l'exoneration`,
            dates: { created: new Date().valueOf() }
        },
        //Importation de billets etrangers 
        {
            _id: new ObjectId('65f3728955fff21fd3f084a4'),
            label: "Autorisation d'importation de billets etrangers delivree par la BEAC",
            extension: '*',
            description: `Autorisation d'importation de billets etrangers delivree par la BEAC`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a5'),
            label: "Contrat liant la banque et le fournisseur de billets de banque etrangers",
            extension: '*',
            description: `Contrat liant la banque et le fournisseur de billets de banque etrangers`,
            dates: { created: new Date().valueOf() }
        },
        //Allocation de devises aux voyageurs 
        {
            _id: new ObjectId('65f3728955fff21fd3f084a6'),
            label: "Document de voyage en cours de validite",
            extension: '*',
            description: `Document de voyage en cours de validite`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a7'),
            label: "Titre de transport",
            extension: '*',
            description: `Titre de transport`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a8'),
            label: "Engagement de fournir les documents justifiant les depenses effectuees au-dela du seuil correspondant a la contrevaleur de cinq (05) millions de FCFA",
            extension: '*',
            description: `Engagement de fournir les documents justifiant les depenses effectuees au-dela du seuil correspondant a la contrevaleur de cinq (05) millions de FCFA`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3728955fff21fd3f084a9'),
            label: "Engagement de fournir les documents justifiant les depenses effectuees au-dela du seuil correspondant a la contrevaleur de cinq (05) millions de FCFA",
            extension: '*',
            description: `Engagement de fournir les documents justifiant les depenses effectuees au-dela du seuil correspondant a la contrevaleur de cinq (05) millions de FCFA`,
            dates: { created: new Date().valueOf() }
        },

        //Revenus du travail (exclusivement pour les residents etrangers et non­ residents) 
        // ****quelle que  soit la nature *****//
        {
            _id: new ObjectId('65f372f955fff21fd3f084aa'),
            label: "Visa",
            extension: '*',
            description: `Visa`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f372f955fff21fd3f084ab'),
            label: "Carte de sejour",
            extension: '*',
            description: `Carte de sejour en cours de validite pour les residents etrangers`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f372f955fff21fd3f084ac'),
            label: "Preuve de paiement de l'impot lie au travail",
            extension: '*',
            description: `Preuve de paiement de l'impot lie au travail`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f372f955fff21fd3f084ad'),
            label: "Attestation de delegation de transfert de revenus de travail",
            extension: '*',
            description: `Attestation de delegation de transfer! de revenus de travail`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f372f955fff21fd3f084ae'),
            label: "Releve d'identite bancaire (RIB)",
            extension: '*',
            description: `Releve d'identite bancaire (RIB) `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f372f955fff21fd3f084af'),
            label: "Lettre de prise d'acte de la BEAC ",
            extension: '*',
            description: `Lettre de prise d'acte de la BEAC relative a la declaration prealable (pour les revenus excedant la contrevaleur de I00 millions de francs CFA)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b0'),
            label: "Preuve de la prise en charge des frais de subsistance ",
            extension: '*',
            description: `Preuve de la prise en charge des frais de subsistance`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b1'),
            label: "Preuve de la prise en charge des frais de subsistance ",
            extension: '*',
            description: `Preuve de la prise en charge des frais de subsistance`,
            dates: { created: new Date().valueOf() }
        },
        // ****Salaires  *****//
        {
            _id: new ObjectId('65f3735155fff21fd3f084b2'),
            label: "Contrat de travail ",
            extension: '*',
            description: `Contrat de travail`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b3'),
            label: "autorisation de travail",
            extension: '*',
            description: `autorisation de travail`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b4'),
            label: "Bulletin de salaires",
            extension: '*',
            description: `Bulletin de salaires`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b5'),
            label: "Attestation de presence au poste delivree par l'employeur",
            extension: '*',
            description: `Attestation de presence au poste delivree par l'employeur`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b6'),
            label: "avis de credit",
            extension: '*',
            description: `avis de credit`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b7'),
            label: "extrait de compte",
            extension: '*',
            description: `extrait de compte`,
            dates: { created: new Date().valueOf() }
        },
        //**** Honoraires ****/
        {
            _id: new ObjectId('65f3735155fff21fd3f084b8'),
            label: "extrait de compte",
            extension: '*',
            description: `extrait de compte`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f3735155fff21fd3f084b9'),
            label: "bon de comrnande",
            extension: '*',
            description: `bon de comrnande `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f373a655fff21fd3f084ba'),
            label: "Facture d'honoraire ",
            extension: '*',
            description: `Facture d'honoraire  `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f373a655fff21fd3f084bb'),
            label: "Preuve de l'encaissement des honoraires",
            extension: '*',
            description: `Preuve de I'encaissement des honoraires`,
            dates: { created: new Date().valueOf() }
        },
        //****Pcrdicms, indemnites diverses et avantages sociaux ****/
        {
            _id: new ObjectId('65f373a655fff21fd3f084bc'),
            label: "Preuve de l'encaissement",
            extension: '*',
            description: `Preuve de l'encaissement. `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f373a655fff21fd3f084bd'),
            label: "Tout document liant le non-resident ou le resident etranger a I'entite ayant regle le revenu du travaiI ",
            extension: '*',
            description: `Tout document liant le non-resident ou le resident etranger a I'entite ayant regle le revenu du travaiI  `,
            dates: { created: new Date().valueOf() }
        },
        //Transfert des rcvenus des vcntcs au benefice des compagnics acrienncs non residentes //
        {
            _id: new ObjectId('65f373a655fff21fd3f084be'),
            label: "Tout document liant le non-resident ou le resident etranger a I'entite ayant regle le revenu du travaiI ",
            extension: '*',
            description: `Tout document liant le non-resident ou le resident etranger a I'entite ayant regle le revenu du travaiI  `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f373a655fff21fd3f084bf'),
            label: "Etats des ventes",
            extension: '*',
            description: `Etats des ventes (IATA Billing and settlement plan) `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c0'),
            label: "Releve des dcpenses locales sur le periode de reference ",
            extension: '*',
            description: `Releve des dcpenses locales sur le periode de reference `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c1'),
            label: "Recapitulatif tamponne et signe des ventes, des depenses et du solde de la periode",
            extension: '*',
            description: `Recapitulatif tamponne et signe des ventes, des depenses et du solde de la periode`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c2'),
            label: "Etats financiers",
            extension: '*',
            description: `Etats financiers`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c3'),
            label: "DSF",
            extension: '*',
            description: `DSF des deux derniers excrcices clotures;`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c4'),
            label: "Convention avec la compagnie aerienne non residente ",
            extension: '*',
            description: `Convention avec la compagnie aerienne non residente `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c5'),
            label: "Preuve de reglement de l'impot lie ",
            extension: '*',
            description: `Preuve de reglement de l'impot lie `,
            dates: { created: new Date().valueOf() }
        },
        //Transfert des revenus des ventes au benefice des distributeurs d'images non­ residents //
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c7'),
            label: "Contrat de commissionnaire a la vente dument enregistre aupres des autorites fiscales",
            extension: '*',
            description: `Contrat de commissionnaire a la vente dument enregistre aupres des autorites fiscales`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c8'),
            label: "Etat des ventes des abonnes par bouquet sur la periode de reference ",
            extension: '*',
            description: `Etat des ventes des abonnes par bouquet sur la periode de reference `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084c9'),
            label: "Statistique des abonnements par bouquet (nombre d'abonnes, tarifs mensuels, nombre de distributeurs agrees) ",
            extension: '*',
            description: `Statistique des abonnements par bouquet (nombre d'abonnes, tarifs mensuels, nombre de distributeurs agrees)  `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084ca'),
            label: "Liste des distributeurs agrees et modeles de contrats ",
            extension: '*',
            description: `Liste des distributeurs agrees et modeles de contrats  `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084cb'),
            label: "Chiffre d'affaires sur lequel porte la commission  ",
            extension: '*',
            description: `Chiffre d'affaires sur lequel porte la commission `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084cc'),
            label: "Etat statistique des revenus des ventes transferes sur les six (06) derniers mois  ",
            extension: '*',
            description: `Etat statistique des revenus des ventes transferes sur les six (06) derniers mois`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084cd'),
            label: "Facture adressee par le commettant ",
            extension: '*',
            description: `Facture adressee par le commettant; `,
            dates: { created: new Date().valueOf() }
        },
        //Redevnnces de marque //
        {
            _id: new ObjectId('65f378cf55fff21fd3f084ce'),
            label: "Contrat de commissionnement dument enregistre aupres des autorites fiscales",
            extension: '*',
            description: `Contrat de commissionnement dument enregistre aupres des autorites fiscales`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f378cf55fff21fd3f084cf'),
            label: "Actes d'enregistrernent de la marque aupres des autorites de propriete intellectuelle par le titulaire de la marque",
            extension: '*',
            description: `Actes d'enregistrernent de la marque aupres des autorites de propriete intellectuelle par le titulaire de la marque`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f379a555fff21fd3f084d0'),
            label: "Chiffre d'affaires sur la periode de reference",
            extension: '*',
            description: `Chiffre d'affaires sur la periode de reference`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f379a555fff21fd3f084d1'),
            label: "Etat statistique des redevances de marque transferees sur les trois (03) dcrnieres periodes",
            extension: '*',
            description: `Etat statistique des redevances de marque transferees sur les trois (03) dcrnieres periodes`,
            dates: { created: new Date().valueOf() }
        },
        //Transfer rapide
        {
            _id: new ObjectId('65f35d9d55fff21fd3f0843c'),
            label: "Releve de compte materialisant l'execution des transactions anterieures",
            extension: '*',
            description: `Releve de compte materialisant l'execution des transactions anterieures`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35de955fff21fd3f0843d'),
            label: "Etat des rapatriements effectues sur la quinzaine",
            extension: '*',
            description: `Etat des rapatriements effectues sur la quinzaine`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e1855fff21fd3f0843e'),
            label: "Etat des ordres de paiement reçus en faveur des agents et/ou des sous agents",
            extension: '*',
            description: `Etat des ordres de paiement reçus en faveur des agents et/ou des sous agents`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e1855fff21fd3f0843f'),
            label: "Etat detaille des transferts emis et reçus justifiant le solde (dates, identites)",
            extension: '*',
            description: `Etat detaille des transferts emis et reçus justifiant le solde (dates, identites)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f379a555fff21fd3f084d2'),
            label: "Etat detaille des transferts emis et reçus justifiant le solde (dates, identites,Etat detaille des transferts emis et reçus justifiant le solde (dates, identites)",
            extension: '*',
            description: `Etat detaille des transferts emis et reçus justifiant le solde (dates, identites,Etat detaille des transferts emis et reçus justifiant le solde (dates, identites)`,
            dates: { created: new Date().valueOf() }
        },
        //Couverture des soldcs de compensation monetique (Visa, Mastercard, etc.)
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08440'),
            label: "Une convention avec l'operateur de paiement",
            extension: '*',
            description: `Une convention avec l'operateur de paiement`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08441'),
            label: "Les extraits de comptc (MT940/T950) laissant apparaitre les soldes des compensation a couvrir",
            extension: '*',
            description: `Les extraits de comptc (MT940/T950) laissant apparaitre les soldes des compensation a couvrir`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08442'),
            label: "Etat des derniers soldes couverts par la BEAC",
            extension: '*',
            description: `Etat des derniers soldes couverts par la BEAC`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08443'),
            label: "Les avis de couverture des soldes de compensation de l'operateur (settlement summary report)",
            extension: '*',
            description: `Les avis de couverture des soldes de compensation de l'operateur (settlement summary report)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08444'),
            label: "Le message de notification de solde de compensation de la banque de reglement (MT103)",
            extension: '*',
            description: `Le message de notification de solde de compensation de la banque de reglement (MT103)`,
            dates: { created: new Date().valueOf() }
        },
        //Aide familiale ou soutien financier a des proches
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08445'),
            label: "Lettre du donneur d'ordre indiquant le motif de l'operation et sa relation avec le beneficiaire final",
            extension: '*',
            description: `Lettre du donneur d'ordre indiquant le motif de l'operation et sa relation avec le beneficiaire final`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08446'),
            label: "Copie de la piece d'identite du beneficiaire final ou titre de sejour (en cours de validite) ",
            extension: '*',
            description: `Copie de la piece d'identite du beneficiaire final ou titre de sejour (en cours de validite) `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08447'),
            label: "Declaration de l'origine des fonds et justificatifs ",
            extension: '*',
            description: `Declaration de l'origine des fonds et justificatifs `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08449'),
            label: "Copie de la carte d'eleve ou d'etudiant",
            extension: '*',
            description: `Copie de la carte d'eleve ou d'etudiant`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0844a'),
            label: "Attestation d'inscription ",
            extension: '*',
            description: `Attestation d'inscription `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0844b'),
            label: "Facture d'inscription",
            extension: '*',
            description: `Facture d'inscription`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0844c'),
            label: "Preuve de la non-residence du beneficiaire dans la sous-region",
            extension: '*',
            description: `Preuve de la non-residence du beneficiaire dans la sous-region`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0844d'),
            label: "Etat des charges de subsistance",
            extension: '*',
            description: `Etat des charges de subsistance`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0844e'),
            label: "Avis medical",
            extension: '*',
            description: `Avis medical`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0844f'),
            label: "autorisation de sortie pour evacuation sanitaire",
            extension: '*',
            description: `autorisation de sortie pour evacuation sanitaire`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08450'),
            label: "Attestation de sejour hospitalier",
            extension: '*',
            description: `Attestation de sejour hospitalier`,
            dates: { created: new Date().valueOf() }
        },
        //Approvisionnement de compte
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08452'),
            label: "Approvisionnement de compte",
            extension: '*',
            description: `Approvisionnement de compte`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08453'),
            label: "Objet de l'operation qui doit correspondre a une des rubriques prevues dans la presente Lettre Circulaire",
            extension: '*',
            description: `Objet de l'operation qui doit correspondre a une des rubriques prevues dans la presente Lettre Circulaire`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08454'),
            label: "Documents exiges suivant la nature de l'operation objet de l'approvisionnement ",
            extension: '*',
            description: `Documents exiges suivant la nature de l'operation objet de l'approvisionnement `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08455'),
            label: "Engagement de fournir les justificatifs de l'execution de l'operation au profit du beneficiaire final ",
            extension: '*',
            description: `Engagement de fournir les justificatifs de l'execution de l'operation au profit du beneficiaire final `,
            dates: { created: new Date().valueOf() }
        },
        //Reglement de loyers
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08456'),
            label: "Copie du titre de propriete du beneficiaire des paiements",
            extension: '*',
            description: `Copie du titre de propriete du beneficiaire des paiements `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08457'),
            label: "tout document en tenant lieu liant le beneficiaire au bien en location",
            extension: '*',
            description: `tout document en tenant lieu liant le beneficiaire au bien en location`,
            dates: { created: new Date().valueOf() }
        },
        //Prets aux non-residents
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08458'),
            label: "Autorisation de la Banque Cenlrale",
            extension: '*',
            description: `Autorisation de la Banque Cenlrale`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08459'),
            label: "Lettre de prise d'acte de la BEAC suite a la declaration a posteriori (pour les etablissements de credit)",
            extension: '*',
            description: `Lettre de prise d'acte de la BEAC suite a la declaration a posteriori (pour les etablissements de credit)`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0845a'),
            label: "Contrat de pret",
            extension: '*',
            description: `Contrat de pret`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0845b'),
            label: "Engagement de rapatriement des revenus du pret et du principal a son terme",
            extension: '*',
            description: ` Engagement de rapatriement des revenus du pret et du principal a son terme`,
            dates: { created: new Date().valueOf() }
        },
        //Remboursement d'emprunt
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0845c'),
            label: "Preuve de la declaration prealable de l'emprunt au Ministere en charge de la monnaie et du credit",
            extension: '*',
            description: `Preuve de la declaration prealable de l'emprunt au Ministere en charge de la monnaie et du credit`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0845d'),
            label: "Lettre de prise d'acte de la BEAC suite a la declaration prealable",
            extension: '*',
            description: `Lettre de prise d'acte de la BEAC suite a la declaration prealable`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0845e'),
            label: "tableau d'amortissement de l'emprunt",
            extension: '*',
            description: `tableau d'amortissement de l'emprunt`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0845f'),
            label: "Echeancier de remboursement",
            extension: '*',
            description: `Echeancier de remboursement`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08460'),
            label: "Tout document etablissant le rapatriement de l'emprunt ou l'effectivite des acquisitions realisees",
            extension: '*',
            description: `Tout document etablissant le rapatriement de l'emprunt ou l'effectivite des acquisitions realisees`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08461'),
            label: "Preuve de retrocession des fonds a la BEAC",
            extension: '*',
            description: `Preuve de retrocession des fonds a la BEAC`,
            dates: { created: new Date().valueOf() }
        },
        //Revenu de capital (benefice, dividende)
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08462'),
            label: "Copie du PV de l'Assemblee Generale",
            extension: '*',
            description: `Copie du PV de l'Assemblee Generale ayant decide de la distribution des dividendes`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08463'),
            label: "Copie du PV du Conseil d'Administration",
            extension: '*',
            description: `Copie du PV du Conseil d'Administration ayant decide de la distribution des dividendes`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08464'),
            label: "Tableau de distribution des dividendes",
            extension: '*',
            description: `Tableau de distribution des dividendes`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08465'),
            label: "Ordonnance du tribunal prolongeant le paiement des dividendes d'exercices anterieurs",
            extension: '*',
            description: `Ordonnance du tribunal prolongeant le paiement des dividendes d'exercices anterieurs ou d'un exercice cloture  y a plus de neuf (09) mois`,
            dates: { created: new Date().valueOf() }
        },
        //Investissernent direct sortant
        //Produit de liquidation ou de cession d'un investissement direct
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08466'),
            label: "Declaration prealable au Ministere en charge de la monnaie et du credit",
            extension: '*',
            description: `Declaration prealable au Ministere en charge de la monnaie et du credit`,
            dates: { created: new Date().valueOf() }
        },
        //Investissernent de portefeuille  sortant
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08467'),
            label: "Autorisation prealable de la Banque Centrale",
            extension: '*',
            description: `Autorisation prealable de la Banque Centrale`,
            dates: { created: new Date().valueOf() }
        },
        //Cession d'un investissement de portefeuille
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08468'),
            label: "Tout document justifiant la cession et le montant a transferer ",
            extension: '*',
            description: `Tout document justifiant la cession et le montant a transferer `,
            dates: { created: new Date().valueOf() }
        },
        //Dons hors de la CEMAC
        //Primes d'assurance ou de reassurance
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08469'),
            label: "Contrat d'assurance ou de reassurance",
            extension: '*',
            description: `Contrat d'assurance ou de reassurance`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0846a'),
            label: "Autorisation du Ministere en charge des assurances",
            extension: '*',
            description: `Autorisation du Ministere en charge des assurances (Les articles 3 et 308 du code CIMA conditionnent le paiement des primes en devises a une autorisation du Ministre en charge des assurances clans le pays`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0846b'),
            label: "Contrat d'assurance ou de reassurance",
            extension: '*',
            description: `Contrat d'assurance ou de reassurance`,
            dates: { created: new Date().valueOf() }
        },
        //Paiement des frais de droits et commissions d'abonnement a un organisme boursier
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0846c'),
            label: "Attestation d'inscription au marche boursier",
            extension: '*',
            description: `Attestation d'inscription au marche boursier`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0846d'),
            label: "Copie des regles du marche faisant ressortir le montant et a  la frequence des paiements relatifs aux frais d'abonnement",
            extension: '*',
            description: `Copie des regles du marche faisant ressortir le montant et  la frequence des paiements relatifs aux frais d'abonnement`,
            dates: { created: new Date().valueOf() }
        },
        //Adhesion aux institutions, reseaux et associations intcrnationales
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0846e'),
            label: "Acte d'adhesion au service ou tout document en tenant lieu ",
            extension: '*',
            description: `Acte d'adhesion au service ou tout document en tenant lieu `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0846f'),
            label: "Tout document emanant du beneficiaire faisant ressortir le montant et la frequence de paiement des frais afferents aux prestations ",
            extension: '*',
            description: `Tout document emanant du beneficiaire faisant ressortir le montant et la frequence de paiement des frais afferents aux prestations`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08470'),
            label: "Acte constitutif de l'entite beneficiaire ",
            extension: '*',
            description: `Acte constitutif de l'entite beneficiaire`,
            dates: { created: new Date().valueOf() }
        },
        //Retour de fonds
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08472'),
            label: "Note explicative de la raison de la demande de retour de fonds ",
            extension: '*',
            description: `Note explicative de la raison de la demande de retour de fonds`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08473'),
            label: "MT202 de retrocession",
            extension: '*',
            description: `MT202 de retrocession `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08474'),
            label: "MT900 materialisant la retrocession",
            extension: '*',
            description: `MT900 materialisant la retrocession`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08475'),
            label: "MT940/950 materialisant la retrocession",
            extension: '*',
            description: `MT940/950  materialisant la retrocession`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08476'),
            label: "MT940/950 materialisant la retrocession",
            extension: '*',
            description: `MT940/950  materialisant la retrocession`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08477'),
            label: "Tout document complementaire explicatif",
            extension: '*',
            description: `Tout document complementaire explicatif`,
            dates: { created: new Date().valueOf() }
        },
        //Paiement des interets de retard sur facture
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08479'),
            label: "Facture d'origine dument declaree et domiciliee",
            extension: '*',
            description: `Facture d'origine dument declaree et domiciliee`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0847a'),
            label: "Convention avec le fournisseur prevoyant le paiement des interets de retard en cas de defaut",
            extension: '*',
            description: `Convention avec le fournisseur prevoyant le paiement des interets de retard en cas de defaut`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0847b'),
            label: "Lettre de relance du fournisseur",
            extension: '*',
            description: `Lettre de relance du fournisseur`,
            dates: { created: new Date().valueOf() }
        },
        //Paiement des impots et taxes dus a une administration etrangere
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0847c'),
            label: "Copie de l'avis d'imposition",
            extension: '*',
            description: `Copie de l'avis d'imposition`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0847d'),
            label: "Copie des statuts ou de tout autre document en tenant lieu precisant Jes conditions de paiement des jetons de presence",
            extension: '*',
            description: `Copie des statuts ou de tout autre document en tenant lieu precisant Jes conditions de paiement des jetons de presence`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0847e'),
            label: "Document fixant le montant et Jes conditions de paiemem des jetons de presence",
            extension: '*',
            description: `Document fixant le montant et Jes conditions de paiemem des jetons de presence`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f0847f'),
            label: "Lettre de convocation",
            extension: '*',
            description: `Lettre de convocation`,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08480'),
            label: "Copie du proces-verbal de l'organe de decision",
            extension: '*',
            description: `Copie du proces-verbal de l'organe de decision`,
            dates: { created: new Date().valueOf() }
        },
        //Paiement des interets de rcta rd sur les remboursements d'emprunts
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08481'),
            label: "Tout document etablissant le rapatriement de l'emprunt ou l'effectivite des acquisitions realisees ",
            extension: '*',
            description: `Tout document etablissant le rapatriement de l'emprunt ou l'effectivite des acquisitions realisees `,
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08482'),
            label: "Message du creancier relatif au defaut de paiement",
            extension: '*',
            description: `Message du creancier relatif au defaut de paiement `,
            dates: { created: new Date().valueOf() }
        },
        //Remboursement des avances en compte courant
        {
            _id: new ObjectId('65f35e8c55fff21fd3f08483'),
            label: "Convention portant sur l'operation",
            extension: '*',
            description: `Convention portant sur l'operation `,
            dates: { created: new Date().valueOf() }
        },


















        // Bénéficiaires opérations internationales (Lettre BEAC 14 Mars 2022)
        {
            _id: new ObjectId('663b51ea8a2026c4c0a3500b'),
            label: 'La fiche KYC établie par la banque',
            extension: '*',
            description: 'KYC (connaissance du client etablie par la banque)',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b521b8a2026c4c0a3500c'),
            label: 'Plan de localisation du domicile',
            extension: '*',
            description: 'Plan de localisation du domicile',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52298a2026c4c0a3500d'),
            label: "Justification de domicile (facture d'eau ou d'électricité, ...)",
            extension: '*',
            description: "Justification de domice  (facture d'eau, electricite etc)",
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b522e8a2026c4c0a3500e'),
            label: 'Copie de la CNI ou du passport ou tout document tenant lieu',
            extension: '*',
            description: 'Copie de la CNI ou du passport ou tout document tenant lieu',
            dates: { created: new Date().valueOf() }
        },


        {
            _id: new ObjectId('663b525c8a2026c4c0a35012'),
            label: 'Plan de localisation du siege sociale',
            extension: '*',
            description: 'Plan de localisation du siege sociale',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b526f8a2026c4c0a35013'),
            label: "Justification du siege social",
            extension: '*',
            description: "Justification du siege social  (facture d'eau, electricite etc)",
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52748a2026c4c0a35014'),
            label: 'Extrait du RCCM le plus récent ou tout document en tenant lieu',
            extension: '*',
            description: 'Extrait du registre de commerce et du credit mobilier(RCCM) le plus recent ou tout autre document en tenant lieu',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b527c8a2026c4c0a35015'),
            label: 'Copie de la CNI ou du passport des signataires agissant pour le compte du donneur d\'ordre personne morale',
            extension: '*',
            description: 'Copie de la carte nationale d\'identite ou du passport des signataires agissant pour le compte du donneur d\'ordre personne morale',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52868a2026c4c0a35016'),
            label: 'Copie des statuts authentifies par une par une autorite habiletée',
            extension: '*',
            description: 'Copie des statuts authentifies par une par une autorite habiletée',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52978a2026c4c0a35017'),
            label: 'Attestation d\'identification fiscale indiquant le NIU ou tout autre document tenant lieu',
            extension: '*',
            description: 'Attestation d\'identification fiscale indiquant le numero d\'identification unique ou tout autre document en tenant lieu',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b529c8a2026c4c0a35018'),
            label: 'Copie du proces verbal nommant les dirigeants ou tout autre document tenant lieu',
            extension: '*',
            description: 'Copie du proces verbal nommant les dirigeants ou tout autre document en tenant lieu',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52ad8a2026c4c0a35019'),
            label: 'Copie de la CNI ou du passport des dirigeants',
            extension: '*',
            description: 'Copie de la carte nationale d\'identite ou du passport des dirigeants',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52b38a2026c4c0a3501a'),
            label: "Etats financiers certifies des trois derniers exercices ou DSF des trois derniers exercices",
            extension: '*',
            description: 'Etats financiers certifies des trois derniers exercices ou declaration statistique et fiscale (DSF) des trois derniers exercices lorsque les etats financiers certifies ne sont pas disponibles',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663b52c38a2026c4c0a3501b'),
            label: 'Declaration sur l\'honneur certifiant l\'exactitude des documents et informations transmises et engageant le donneur d\'ordre à informer l\'établissement de crédit en cas de tout changement',
            extension: '*',
            description: 'Declaration sur l\'honneur certifiant l\'exactitude des documents et informations transmises et engageant le donneur d\'ordre a informer l\'etablissement de credit en cas de tout changement',
            dates: { created: new Date().valueOf() }
        },


        {
            _id: new ObjectId('663df50e8a2026c4c0a3501c'),
            label: 'Copie des status authentifiés par une autorité habilitée',
            extension: '*',
            description: 'Copie des status authentifiés par une autorité habilitée',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df51a8a2026c4c0a3501d'),
            label: 'Extrait du registre du commerce le plus récent ou tout document tenant lieu',
            extension: '*',
            description: 'Le document transmis devant obligatorement indiquer la dénomination social, l\'objet social, l\'adresse et la date de création',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df53d8a2026c4c0a3501f'),
            label: 'Liste des actionnaires ou promoteurs et répartition du capital',
            extension: '*',
            description: 'Liste des actionnaires ou promoteurs et répartition du capital',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df57a8a2026c4c0a35020'),
            label: 'Liste des ayant droits finaux personnes physiques',
            extension: '*',
            description: 'Liste des ayant droits finaux personnes physiques',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df5808a2026c4c0a35021'),
            label: 'Copie du procès-verbal nommant les dirigeants ou tout autre document tenant lieu',
            extension: '*',
            description: 'Copie du procès-verbal nommant les dirigeants ou tout autre document tenant lieu',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df58a8a2026c4c0a35022'),
            label: 'Copie de la CNI ou du passeport des dirigeants',
            extension: '*',
            description: 'Copie de la CNI ou du passeport des dirigeants',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df5998a2026c4c0a35023'),
            label: 'Fiche ou attestation KYC ou tout document tenant lieu établie par la banque du bénéficiaire attestant de l\'existence et de la régularité du compte au regard des dispositions relatives à',
            extension: '*',
            description: 'Fiche ou attestation KYC (connaissance du client) ou tout document tenant lieu établie par la banque du bénéficiaire attestant de l\'existence et de la régularité du compte au regard des dispositions relatives à la Lutte conte le Blanchiment des Capitaux, le Financement du Terrorisme et la Prolifération (LCB:FTP)',
            dates: { created: new Date().valueOf() }
        },
        {
            _id: new ObjectId('663df59e8a2026c4c0a35024'),
            label: 'Prise d\'acte sur la déclaration du compte à la Banque Centrale pour les bénéficiaires résident de la CEMAC',
            extension: '*',
            description: 'Prise d\'acte sur la déclaration du compte à la Banque Centrale pour les bénéficiaires résident de la CEMAC',
            dates: { created: new Date().valueOf() }
        },
    ]

    console.log('Insert default vouchers into vouchers collection');

    const collectionsExists = await db.listCollections({ name: 'visa_operations_vouchers' }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("visa_operations_vouchers").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('visa_operations_vouchers').insertMany(vouchers);
    console.log(response.insertedIds);

};