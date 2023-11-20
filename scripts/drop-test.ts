
import { dropTestCollections } from './tests/drop-test-collections';
import readline from 'readline';

const runScripts = async () => {
    // SCRIPTS to execute

    await dropTestCollections();
 
}

(async () => {
    try {
        const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });

        console.log('* Start drop visa operation collections scripts');
        console.log(`Like: \n'visa_transactions_tmp'\n'visa_transactions_replica'\n'visa_transactions'\n'visa_transactions'\n'visa_operations_travels'\n'visa_operations_travel_months'\n'visa_operations_online_payments'\n'queue'\n'notifications'`);

        prompt.question('* Voulez-vous continuer? (y/n): ', async (answer) => {
            if (['y', 'yes', 'Y', 'YES'].includes(answer)) await runScripts();

            prompt.close();
        });

        prompt.on('close', () => {
            process.exit();
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

})()
