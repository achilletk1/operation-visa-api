import { inserDefaultVouchers } from './helpers/insert-default-vouchers';
import  Confirm from 'prompt-confirm';
import { config } from './config-env';
import { inserDefaultLongTravelsTypes } from './helpers/insert-default-long-travels-types';
import { inserDefaultSetting } from './helpers/insert-default-settings';
import { inserDefaultVisaCeilings } from './helpers/insert-default-ceiling';

const runScripts = async () => {
    // SCRIPTS to execute
   await inserDefaultLongTravelsTypes();
   await inserDefaultVouchers();
   await inserDefaultSetting();
   await inserDefaultVisaCeilings();
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
