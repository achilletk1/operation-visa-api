import { inserDefaultVouchers } from './helpers/insert-default-vouchers';
import { inserDefaultTransfertTypes } from './helpers/insert-default-transfert-types';
import * as Confirm from 'prompt-confirm';
import { config } from './config-env';

const runScripts = async () => {
    // SCRIPTS to execute
   await inserDefaultTransfertTypes();
   await inserDefaultVouchers();
}

if (config.get('env') !== 'development') {
    (async () => {
        await runScripts();
        process.exit();
    })()
} else {
    (async () => {
        try {
            const answer = await new Confirm('Start reset BCIONLINE database scripts').run();

            if (answer === false) { return process.exit(); }

            await runScripts()

            process.exit();

        } catch (error) {
            console.log(error);
            process.exit(1);
        }

    })()
}
