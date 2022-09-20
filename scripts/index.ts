import { inserDefaultVouchers } from './helpers/insert-default-vouchers';
import * as Confirm from 'prompt-confirm';
import { config } from './config-env';
import { inserDefaultLongTravelsTypes } from './helpers/insert-default-long-travels-types';

const runScripts = async () => {
    // SCRIPTS to execute
//    await inserDefaultLongTravelsTypes();
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
