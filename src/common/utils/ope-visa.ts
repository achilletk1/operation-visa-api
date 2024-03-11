import { ExpenseCategory, OperationType, OperationTypeLabel, OpeVisaStatus } from "modules/visa-operations";
import { VisaTransaction } from 'modules/visa-transactions';
import { isEmpty } from "lodash";

export function getTotal(transactions: VisaTransaction[] | undefined, type?: string | 'stepAmount') {
    if (!transactions || isEmpty(transactions)) { return 0; }

    if (type === 'stepAmount') { transactions = transactions.filter(elt => [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED].includes(elt?.status as OpeVisaStatus)) }

    const totalAmountTransaction = transactions.map(elt => +(elt?.amount as number)).reduce((elt, prev) => elt + prev, 0);

    return totalAmountTransaction;
};

export function getOnpStatementStepStatus(data: any, step?: 'onp' | 'othersAttachs' | 'expenseDetail' | 'month') {
    if (!data) { throw new Error('OnlinePaymentNotDefined'); }
    let array: any[] = []; let total: number = 0;
    if (step === 'onp') {
        if (isEmpty(data?.statements)) { return OpeVisaStatus.EMPTY };
        array = data?.statements;
        total = data?.statementAmounts;
    }
    if (step === 'month') {
        if (isEmpty(data?.expenseDetails)) { return OpeVisaStatus.EMPTY };
        array = data?.expenseDetails;
        total = data?.expenseDetailsAmount;
    }
    if (step === 'othersAttachs') {
        if (isEmpty(data?.othersAttachements)) { return OpeVisaStatus.EMPTY };
        array = data?.othersAttachements;
        total = data?.otherAttachmentAmount;
    }
    if (step === 'expenseDetail') {
        if (isEmpty(data?.transactions)) { return OpeVisaStatus.EMPTY };
        array = data?.transactions;
        total = array.map(elt => +elt.amount).reduce((elt, prev) => elt + prev, 0);
    }

    let status = array.filter(e => e.isExceed).map(elt => +elt?.status);

    // renvoi le statut à compléter
    if (status.includes(OpeVisaStatus.TO_COMPLETED)
        && !status.includes(OpeVisaStatus.REJECTED)
        && !status.includes(OpeVisaStatus.EXCEEDED)) {
        return OpeVisaStatus.TO_COMPLETED
    }

    // renvoi le statut à valider
    if (status.includes(OpeVisaStatus.TO_VALIDATED)
        && !status.includes(OpeVisaStatus.TO_COMPLETED)
        // && !status.includes(OpeVisaStatus.EMPTY)
        && !status.includes(OpeVisaStatus.REJECTED)
        && !status.includes(OpeVisaStatus.EXCEEDED)
    ) {
        return OpeVisaStatus.TO_VALIDATED;
    }

    // renvoi le statut rejeté
    if (status.includes(OpeVisaStatus.REJECTED) && !status.includes(OpeVisaStatus.EXCEEDED)) { return OpeVisaStatus.REJECTED; }

    // renvoi en chaine de validation
    if (status.includes(OpeVisaStatus.VALIDATION_CHAIN) && !status.includes(OpeVisaStatus.EXCEEDED)) { return OpeVisaStatus.VALIDATION_CHAIN; }

    // renvoi le statut justifié
    if (status.includes(OpeVisaStatus.JUSTIFY)
        && !status.includes(OpeVisaStatus.TO_COMPLETED)
        && !status.includes(OpeVisaStatus.EMPTY)
        && !status.includes(OpeVisaStatus.REJECTED)
        && !status.includes(OpeVisaStatus.TO_VALIDATED)
        && !status.includes(OpeVisaStatus.EXCEEDED)
        && !status.includes(OpeVisaStatus.VALIDATION_CHAIN)
        && !status.includes(OpeVisaStatus.CLOSED)) {
        return OpeVisaStatus.JUSTIFY;
    }

    // renvoi le statut hors délais
    if (status.includes(500)) { return OpeVisaStatus.EXCEEDED; }

    return OpeVisaStatus.TO_COMPLETED;
};

export function getOnpStatus(transaction: VisaTransaction[] | undefined) {
    if (isEmpty(transaction)) { return OpeVisaStatus.EMPTY; }
    const statusList = transaction?.filter(e => e.isExceed).map(elt => elt?.status) || [];
    if (statusList.includes(OpeVisaStatus.REJECTED)) { return OpeVisaStatus.REJECTED; }
    if (statusList.includes(OpeVisaStatus.TO_COMPLETED)) { return OpeVisaStatus.TO_COMPLETED; }
    if (statusList.every(e => e === OpeVisaStatus.VALIDATION_CHAIN)) { return OpeVisaStatus.VALIDATION_CHAIN; }
    if (statusList.every(e => e === OpeVisaStatus.TO_VALIDATED)) { return OpeVisaStatus.TO_VALIDATED; }
    if (statusList.every(e => e === OpeVisaStatus.JUSTIFY)) { return OpeVisaStatus.VALIDATION_CHAIN; }
    return OpeVisaStatus.TO_COMPLETED;
};

export const getStatementByStatus = (statement: any[]) => {
    const tabStatus = [100, 101, 200, 300, 400, 500, 600, 700]
    let data = []
    for (const iterator of tabStatus) {
        const found = statement.filter(v => {
            return v._id === iterator
        }).map((elt) => elt.valueResult);
        let valueResult = 0;
        if (!isEmpty(found)) {
            valueResult = found.reduce((u, v) => u + v);
        }
        data.push({ _id: iterator, valueResult: valueResult });

    }

    return data;
};


export const getStatuslabel = (status: OpeVisaStatus | '') => {
    switch (status) {
        case OpeVisaStatus.TO_COMPLETED: return 'A compléter';
        case OpeVisaStatus.TO_VALIDATED: return 'A valider';
        case OpeVisaStatus.JUSTIFY: return 'Justifié';
        case OpeVisaStatus.REJECTED: return 'Rejeté';
        case OpeVisaStatus.EXCEEDED: return 'Hors délais';
        case OpeVisaStatus.VALIDATION_CHAIN: return 'En cours de validation';
        case OpeVisaStatus.CLOSED: return 'Clôturé';
        default: return 'A compléter';
    }
};

export const getExpenseCategoryLabel = (category: ExpenseCategory | '') => {
    switch (category) {
        case ExpenseCategory.IMPORT_OF_GOODS: return 'Importations de biens';
        case ExpenseCategory.IMPORT_OF_SERVICES: return 'Importations de services';
        default: return 'Autres';
    }
};

export const getOperationTypeLabel = (operationType: OperationType | '') => {
    switch (operationType) {
        case OperationType.ATN_WITHDRAWAL: return OperationTypeLabel.ATN_WITHDRAWAL;
        case OperationType.ELECTRONIC_PAYMENT_TERMINAL: return OperationTypeLabel.ELECTRONIC_PAYMENT_TERMINAL;
        case OperationType.ONLINE_PAYMENT: return OperationTypeLabel.ONLINE_PAYMENT;
        default: return 'Autres';
    }
};

// export function checkIfSendNotification(current: Travel | OnlinePaymentMonth | TravelMonth, databaseData: Travel | TravelMonth | OnlinePaymentMonth |any ) {
//   if ((current?.isUntimely)) {
//     let firstToValidateTransactionIndex;
//     if (current.transactions?.length && databaseData?.transactions?.length) {
//       firstToValidateTransactionIndex = current?.transactions?.findIndex((elt: any, i: number) => { elt.isExceed && (elt.status != databaseData?.transactions[i]?.status && elt.status === OpeVisaStatus.TO_VALIDATED) });
//       if (firstToValidateTransactionIndex > -1) {
//         if (current && current?.editors?.length) {
//           const lastEditorDate = current.editors[current.editors.length - 1 || 0]?.date || 0;
//           if (Math.abs(moment().diff(lastEditorDate, 'minutes')) >= 30) {
//             return { respons: true, line: firstToValidateTransactionIndex }
//           }
//         }
//       }
//     }
//   }
//   return { respons: false }

// }