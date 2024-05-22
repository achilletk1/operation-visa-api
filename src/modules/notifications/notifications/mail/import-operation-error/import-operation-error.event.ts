import { config } from "convict-config";
import { isDev } from "common/helpers";

export class ImportOperationErrorEvent implements ImportOperationErrorData {
    receiver!: string;
    greetings!: string;

    constructor(public readonly errorMessage: string) {
        this.greetings = "Bonjour";
        this.receiver =  config.get(isDev ? "emailTest" : "emailBank");
    }
}

interface ImportOperationErrorData {
    errorMessage: string;
    greetings: string;
    receiver: string;
}