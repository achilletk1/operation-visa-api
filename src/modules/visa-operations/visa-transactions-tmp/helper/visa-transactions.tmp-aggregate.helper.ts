export const formatedVisaTransactionsTmps = [
    {
        $addFields: {
            travel: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: ["$TYPE_TRANS", "RETRAIT DAB",] },
                            { $eq: ["$TYPE_TRANS", "PAIEMENT TPE",], },
                        ],
                    },
                    then: true,
                    else: false,
                },
            },
        },
    },
    {
        $project: {
            clientCode: { $trim: { input: "$CLIENT", }, },
            fullName: { $trim: { input: "$NOM_CLIENT", }, },
            manager: {
                code: { $trim: { input: "$CODE_GESTIONNAIRE", }, },
                name: { $trim: { input: "$NOM_GESTIONNAIRE", }, },
            },
            lang: {
                $cond: {
                    if: {
                        $eq: [{ $trim: { input: "$CODE_LANGUE_CLIENT", }, }, "001",],
                    },
                    then: "fr",
                    else: "en",
                },
            },
            tel: { $trim: { input: "$TELEPHONE_CLIENT", }, },
            email: { $trim: { input: "$EMAIL_CLIENT", }, },
            beneficiary: { $trim: { input: "$ACQUEREUR", }, },
            amount: { $toDouble: "$MONTANT_XAF", },
            amountTrans: { $toDouble: "$MONTANT", },
            currencyTrans: { $trim: { input: "$DEVISE", }, },
            amountCompens: { $toDouble: "$MONTANT_COMPENS", },
            currencyCompens: { $trim: { input: "$DEVISE_COMPENS", }, },
            date: {
                $concat: [
                    { $trim: { input: "$DATE", }, },
                    " ",
                    { $trim: { input: "$HEURE", }, },
                ],
            },
            type: { $trim: { input: "$TYPE_TRANS", }, },
            ncp: { $trim: { input: "$COMPTE", }, },
            age: { $trim: { input: "$AGENCE", }, },
            cha: { $trim: { input: "$CHAPITRE", }, },
            card: {
                name: { $trim: { input: "$NOM_CARTE", }, },
                code: { $trim: { input: "$CARTE", }, },
                label: { $trim: { input: "$PRODUIT", }, },
            },
            country: { $trim: { input: "$PAYS", }, },
            category: { $trim: { input: "$CATEGORIE", }, },
            currentMonth: {
                $dateToString: {
                    format: "%Y%m",
                    date: { $dateFromString: { dateString: "$DATE", format: "%d/%m/%Y", }, },
                },
            },
            reference: "",
            statementRef: "",
            travel: "$travel",
        },
    },
    {
        $group: {
            _id: {
                clientCode: "$clientCode",
                travel: "$travel",
            },
            transactions: { $push: "$$ROOT", },
        },
    },
    {
        $project: {
            clientCode: "$_id.clientCode",
            travel: {
                $cond: {
                    if: { $eq: ["$_id.travel", true], },
                    then: "$transactions",
                    else: [],
                },
            },
            onlinepayment: {
                $cond: {
                    if: { $eq: ["$_id.travel", false], },
                    then: "$transactions",
                    else: [],
                },
            },
        },
    },
    {
        $unwind: {
            path: "$travel",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $unwind: {
            path: "$onlinepayment",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $group: {
            _id: "$clientCode",
            travel: { $push: "$travel" },
            onlinepayment: { $push: "$onlinepayment" },
        },
    },
];