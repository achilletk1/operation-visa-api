import { deleteDirectory, getTotal, readFile, saveAttachment } from "common/utils";
import { VisaOperationsAttachment, OpeVisaStatus, Validator } from "modules/visa-operations";
import { Editor } from "modules/users";
import { Travel } from "../model";
import { isEmpty } from "lodash";
import { TravelMonth } from 'modules/travel-month';

export const saveAttachmentTravel = (attachments: VisaOperationsAttachment[] = [], id: string, date: number = new Date().valueOf()) => {
    for (let attachment of attachments) {
        if (!attachment.temporaryFile) { continue; }

        const content = readFile(String(attachment?.temporaryFile?.path));

        if (!content) { continue; }

        attachment.content = content;

        attachment = saveAttachment(id, attachment, date, 'travel');

        deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
        delete attachment.temporaryFile;
    }

    return attachments;
}

export function getTravelStatus(travel: Travel | TravelMonth, ceilingTravelMonth?: number): OpeVisaStatus {

    if (!travel) { throw new Error('TravelNotDefined'); }
    const amount = getTotal(travel?.transactions || []);
    const ceiling = ceilingTravelMonth || (travel as Travel)?.ceiling
    let status = ceiling && +ceiling < amount ? [((travel as Travel)?.proofTravel?.status || []), travel?.expenseDetailsStatus] : [((travel as Travel)?.proofTravel?.status || [])];

    if (status.every(elt => elt === OpeVisaStatus.EMPTY)) { return OpeVisaStatus.EMPTY; }

    if (status.every(elt => elt === OpeVisaStatus.JUSTIFY)) { return OpeVisaStatus.JUSTIFY; }

    if (status.every(elt => elt === OpeVisaStatus.VALIDATION_CHAIN)) { return OpeVisaStatus.VALIDATION_CHAIN; }

    if (status.every(elt => elt === OpeVisaStatus.CLOSED)) { return OpeVisaStatus.CLOSED; }

    // if (status.includes(OpeVisaStatus.EXCEDEED)) { return OpeVisaStatus.EXCEDEED; }

    if (status.includes(OpeVisaStatus.REJECTED)/* && !status.includes(OpeVisaStatus.EXCEEDED)*/) { return OpeVisaStatus.REJECTED; }

    if (status.includes(OpeVisaStatus.TO_VALIDATED) &&
        /*!status.includes(OpeVisaStatus.EXCEEDED) &&*/
        !status.includes(OpeVisaStatus.TO_COMPLETED) &&
        !status.includes(OpeVisaStatus.EMPTY)
    ) {
        return OpeVisaStatus.TO_VALIDATED;
    }

    if (status.includes(OpeVisaStatus.TO_COMPLETED)/* && !status.includes(OpeVisaStatus.EXCEEDED)*/) {
        return OpeVisaStatus.TO_COMPLETED;
    }
    return OpeVisaStatus.TO_COMPLETED;
}

export function getProofTravelStatus(travel: Travel, maxValidationLevelRequired: number): OpeVisaStatus {

    if (!travel || !travel?.proofTravel) { throw new Error('TravelNotDefined'); }

    const { isPassOut, isPassIn, isTransportTicket, isVisa, proofTravelAttachs, validators } = { ...travel?.proofTravel } || {};

    const labels = ['Ticket de transport', 'Tampon de sortie du passeport', 'Tampon d\'entrée du passeport'];

    if (!isPassOut && !isPassIn && !isTransportTicket && !isVisa) { return OpeVisaStatus.EMPTY; }

    if (!proofTravelAttachs || proofTravelAttachs.filter(e => labels.includes(e.label || '')).length !== 3) { return OpeVisaStatus.TO_COMPLETED; }

    if (!validators || isEmpty(validators) || checkIsUpdateAfterRejection(validators, travel?.editors)) { return OpeVisaStatus.TO_VALIDATED; }

    if (validators[validators?.length - 1]?.status === 300) { return OpeVisaStatus.REJECTED; }

    if (validators?.length !== +maxValidationLevelRequired) { return OpeVisaStatus.VALIDATION_CHAIN; }

    if (travel?.status !== OpeVisaStatus.CLOSED) { return OpeVisaStatus.JUSTIFY; }

    return OpeVisaStatus.CLOSED;
}

const checkIsUpdateAfterRejection = (validators: Validator[] = [], editors: Editor[] = []) => {
    const lastValidator = validators[validators?.length - 1];
    return !isEmpty(validators) && // check if it have min one validation
        lastValidator?.status === 300 && // check if last validators have reject step
        editors.filter(e => e?.date >= +(lastValidator?.date || 0) && e?.steps?.includes('Preuve de voyage'))?.length > 0;
};

export function getPipelineLongTravels(filter: { [key: string]: any }) {
    return [
        // Filtrer les documents de TravelMonth avec un statut différent de 200 et 600
        {
            $match: {
                status: { $nin: [200, 600] },
                ...filter
            }
        },
        // Décomposer le tableau des transactions
        { $unwind: "$transactions" },
        // Filtrer les transactions excédées
        {
            $match: {
                "transactions.isExceed": true
            }
        },
        // Rejoindre les documents du modèle Travel
        {
            $lookup: {
                from: "travels",
                localField: "travelId",
                foreignField: "_id",
                as: "travelDetails"
            }
        },
        // Décompresser le tableau travelDetails
        {
            $unwind: "$travelDetails"
        },
        // Calculer la différence de date en jours entre la première transaction et la fin du mois de la transaction
        {
            $addFields: {
                firstTransactionDate: {
                    $toDate: "$transactions.date"
                },
                transactionEndOfMonth: {
                    $toDate: {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    { $substr: ["$transactions.currentMonth", 0, 4] },
                                    "-",
                                    { $substr: ["$transactions.currentMonth", 4, 2] },
                                    "-",
                                    { $substr: ["$transactions.currentMonth", 6, 2] },
                                    "T00:00:00.000Z"
                                ]
                            },
                            format: "%Y-%m-%d"
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                exceedDays: {
                    $divide: [
                        {
                            $subtract: ["$transactionEndOfMonth", "$firstTransactionDate"]
                        },
                        1000 * 60 * 60 * 24 // Convertir la différence en millisecondes en jours
                    ]
                }
            }
        },
        // Projeter les champs souhaités
        {
            $project: {
                _id: 1,
                status: 1,
                userId: 1,
                travelId: 1,
                month: 1,
                dates: 1,
                expenseDetailsStatus: 1,
                expenseDetailAmount: 1,
                transactions: 1,
                expenseDetailsLevel: 1,
                validators: 1,
                editors: 1,
                isUntimely: 1,
                exceedDays: 1
            }
        }
    ];
}

export function getPipelineShortTravels(filter: { [key: string]: any }) {
    return [
        { $unwind: "$transactions" },
        {
            $match: {
                $and: [
                    (filter) && { ...filter },
                    {
                        $or: [
                            { 'proofTravel.status': { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } },
                            {
                                $and: [
                                    { 'transactions.isExceed': true },
                                    { status: { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } },
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            $addFields: {
                totalTransactionAmount: { $sum: "$transactions.amount" },
                firstTransactionDate: { $min: "$transactions.date" },
                email: "$user.email",
            }
        },
        {
            $group: {
                _id: "$user.clientCode",
                user: { $first: "$user" },
                ceiling: { $first: "$ceiling" },
                totalTransactionAmount: { $sum: "$transactions.amount" },
                firstTransactionDate: { $min: "$transactions.date" },
            }
        },
        {
            $match: {
                $expr: { $gt: ["$totalTransactionAmount", "$ceiling"] }
            }
        }
    ];
}

export function getPipelineOnlinePayement (filter: { [key: string]: any }) {
    return [
        { $match: { $or: [{ status: { $nin: [200, 600] } }, (filter) && { ...filter }] } },
        { $set: { transactions: { $sortArray: { input: '$transactions', sortBy: { date: 1 } } } } },
        {
            $set: {
                excessInfos: {
                    $reduce: {
                        input: '$transactions',
                        initialValue: { sumAmount: 0, exceedDays: null },
                        in: {
                            sumAmount: { $add: ["$$value.sumAmount", "$$this.amount"] },
                            exceedDays: {
                                $cond: [
                                    {
                                        $and: [{ $eq: ['$$value.exceedDays', null] }, { $gt: [{ $add: ['$$value.sumAmount', '$$this.amount'] }, '$ceiling'] }]
                                    },
                                    '$$this.date',
                                    '$$value.exceedDays'
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $set: {
                exceedDays: {
                    $switch: {
                        branches: [
                            {
                                case: { $isNumber: "$excessInfos.exceedDays" },
                                then: { $toDate: "$excessInfos.exceedDays" }
                            },
                            {
                                case: { $regexMatch: { input: "$excessInfos.exceedDays", regex: /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/ } },
                                then: {
                                    $dateFromString: { dateString: "$excessInfos.exceedDays", format: "%d/%m/%Y %H:%M:%S", timezone: "UTC" }
                                }
                            },
                        ],
                        default: "$excessInfos.exceedDays"
                    }
                },
                amounts: "$excessInfos.sumAmount",
            },
        },
        { $unset: 'excessInfos' },
        { $match: { $expr: { $lt: ["$ceiling", "$amounts"] } } },
        { $addFields: { exceedDay: { $dateDiff: { startDate: "$exceedDays", endDate: "$$NOW", unit: "day" } } } },
        {
            $group: {
                _id: "$user.clientCode",
                user: { $first: "$user" },
                excessMonthCount: { $sum: 1 },
                operationsExcess: { $push: "$$ROOT" }
            }
        },
    ];
}