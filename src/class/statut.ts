export const QueueState = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
};

export class State {

    visa_transaction_tmp_treatment = QueueState.PENDING;


    constructor() { }

    setState(state: string, type: string) {
       this.visa_transaction_tmp_treatment = state; 
    }

    getState(type: string) {
        return this.visa_transaction_tmp_treatment; 
    }

};

