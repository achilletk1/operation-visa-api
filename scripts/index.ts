import { inserDefaultLongTravelsTypes } from './helpers/insert-default-long-travels-types';
import { inserDefaultUsersValidations } from './helpers/insert-default-user-validation';
import { inserDefaultPropertyType } from './helpers/insert-default-proprety-type';
import { insertDefaultTemplateSetting } from './helpers/insert-default-template';
import { inserDefaultLetter } from './helpers/insert-default-notice-letter';
import { inserDefaultVisaCeilings } from './helpers/insert-default-ceiling';
import { inserDefaultVouchers } from './helpers/insert-default-vouchers';
import { inserDefaultSetting } from './helpers/insert-default-settings';
import readline from 'readline';

const runScripts = async () => {
    // SCRIPTS to execute
    // await inserDefaultVisaCeilings();
    // await inserDefaultLongTravelsTypes();
    // await inserDefaultLetter();
    // await inserDefaultPropertyType();
    await inserDefaultSetting();
    // await insertDefaultTemplateSetting();
    // await inserDefaultVouchers();
    // await inserDefaultUsersValidations();
}

(async () => {
    try {
        const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });

        console.log('* Start reset visa operation data scripts');

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
