
import { startTransactionsProcessingCron } from "./transaction-processing";

export const startCrons = () => {
    startTransactionsProcessingCron.start();
}