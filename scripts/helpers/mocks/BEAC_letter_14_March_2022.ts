import { PropertyAndServicesTypeCategories } from "../../../src/modules/property-and-services-types/model";
import { ObjectId } from "mongodb";


export const beac_letter_14_March_2022 = [
    {
        label: `Donneur d'ordre personne morale`,
        category: PropertyAndServicesTypeCategories.ORDERING_PARTY,
        vouchers: [
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
        ],
        dates: { created: new Date().valueOf() }
    },
    {
        label: `Donneur d'ordre personne physique`,
        category: PropertyAndServicesTypeCategories.ORDERING_PARTY,
        vouchers: [
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
                _id: new ObjectId('663b52978a2026c4c0a35017'),
                label: 'Attestation d\'identification fiscale indiquant le NIU ou tout autre document tenant lieu',
                extension: '*',
                description: 'Attestation d\'identification fiscale indiquant le numero d\'identification unique ou tout autre document en tenant lieu',
                dates: { created: new Date().valueOf() }
            },
            {
                _id: new ObjectId('663b52c38a2026c4c0a3501b'),
                label: 'Declaration sur l\'honneur certifiant l\'exactitude des documents et informations transmises et engageant le donneur d\'ordre à informer l\'établissement de crédit en cas de tout changement',
                extension: '*',
                description: 'Declaration sur l\'honneur certifiant l\'exactitude des documents et informations transmises et engageant le donneur d\'ordre a informer l\'etablissement de credit en cas de tout changement',
                dates: { created: new Date().valueOf() }
            }
        ],
        dates: { created: new Date().valueOf() }
    },
    {
        label: `Bénéficiaire personne morale`,
        category: PropertyAndServicesTypeCategories.BENEFICIARY,
        vouchers: [
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
        ],
        dates: { created: new Date().valueOf() }
    },
    {
        label: `Bénéficiaire personne physique`,
        category: PropertyAndServicesTypeCategories.BENEFICIARY,
        vouchers: [
            {
                _id: new ObjectId('663b522e8a2026c4c0a3500e'),
                label: 'Copie de la CNI ou du passport ou tout document tenant lieu',
                extension: '*',
                description: 'Copie de la CNI ou du passport ou tout document tenant lieu',
                dates: { created: new Date().valueOf() }
            },
            {
                _id: new ObjectId('663df59e8a2026c4c0a35024'),
                label: 'Prise d\'acte sur la déclaration du compte à la Banque Centrale pour les bénéficiaires résident de la CEMAC',
                extension: '*',
                description: 'Prise d\'acte sur la déclaration du compte à la Banque Centrale pour les bénéficiaires résident de la CEMAC',
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
                _id: new ObjectId('663df5998a2026c4c0a35023'),
                label: 'Fiche ou attestation KYC ou tout document tenant lieu établie par la banque du bénéficiaire attestant de l\'existence et de la régularité du compte au regard des dispositions relatives à',
                extension: '*',
                description: 'Fiche ou attestation KYC (connaissance du client) ou tout document tenant lieu établie par la banque du bénéficiaire attestant de l\'existence et de la régularité du compte au regard des dispositions relatives à la Lutte conte le Blanchiment des Capitaux, le Financement du Terrorisme et la Prolifération (LCB:FTP)',
                dates: { created: new Date().valueOf() }
            },
        ],
        dates: { created: new Date().valueOf() }
    },
];
