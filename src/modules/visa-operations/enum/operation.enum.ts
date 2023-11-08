export enum OperationType {
    ELECTRONIC_PAYMENT_TERMINAL = 100,
    ATN_WITHDRAWAL = 200,
    ONLINE_PAYMENT = 300
}

export enum OperationStatus {
    UNAVAILABLE = 100, // aucun upload,
    AVAILABLE = 101, // au moins un upload,
    PENDING = 200, //  upload complet , en cours
    ACCEPTED = 201, // accepté
    REJECTED = 202, //  refusé
}


