import { config } from "convict-config";

export class ImportOperationErrorEvent implements ImportOperationErrorData {
    receiver!: string;
    greetings!: string;
    errorMessage!: string;

    constructor(errorMessage: string) {
        this.greetings = "Bonjour";
        this.receiver = config.get('env') === 'development' ? config.get("emailTest") : config.get("emailBank");
        this.errorMessage = errorMessage;
    }
}

interface ImportOperationErrorData {
    greetings: string;
    receiver: string;
    errorMessage: string;
}