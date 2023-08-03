import { inserDefaultLongTravelsTypes } from './helpers/insert-default-long-travels-types';
import { inserDefaultPropertyType } from './helpers/insert-default-proprety-type';
import { insertDefaultTemplateSetting } from './helpers/insert-default-template';
import { inserDefaultLetter } from './helpers/insert-default-notice-letter';
import { inserDefaultVisaCeilings } from './helpers/insert-default-ceiling';
import { inserDefaultVouchers } from './helpers/insert-default-vouchers';
import { inserDefaultSetting } from './helpers/insert-default-settings';
import { config } from './config-env';
import Confirm from 'prompt-confirm';

const runScripts = async () => {
    // SCRIPTS to execute
    await inserDefaultVisaCeilings();
    await inserDefaultLongTravelsTypes();
    await inserDefaultLetter();
    await inserDefaultPropertyType();
    await inserDefaultSetting();
    await insertDefaultTemplateSetting();
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
            const answer = await new Confirm('Start reset visa operation data scripts').run();

            if (answer === false) { return process.exit(); }

            await runScripts()

            process.exit();

        } catch (error) {
            console.log(error);
            process.exit(1);
        }

    })()
}


