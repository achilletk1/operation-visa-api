import { inserDefaultBankAccountManager } from './helpers/insert-default-bank-acount-manager';
import { inserDefaultLongTravelsTypes } from './helpers/insert-default-long-travels-types';
import { inserDefaultUsersCardsTypes } from './helpers/insert-default-cards-types';
import { inserDefaultPropertyType } from './helpers/insert-default-proprety-type';
import { insertDefaultTemplateSetting } from './helpers/insert-default-template';
import { inserDefaultLetter } from './helpers/insert-default-notice-letter';
import { inserDefaultVisaCeilings } from './helpers/insert-default-ceiling';
import { inserDefaultBankUsers } from './helpers/insert-default-bank-users';
import { inserDefaultVouchers } from './helpers/insert-default-vouchers';
import { inserDefaultSetting } from './helpers/insert-default-settings';
import { dropTestCollections } from './tests/drop-test-collections';
import readline from 'readline';
import { inserDefaultSuppliersVouchers } from './helpers/insert-default-suppliers-vouchers';

const runScripts = async () => {
    // SCRIPTS to execute
    await dropTestCollections();
    await inserDefaultVisaCeilings();
    await inserDefaultLongTravelsTypes();
    await inserDefaultLetter();
    await inserDefaultPropertyType();
    await inserDefaultSuppliersVouchers();
    await inserDefaultSetting();
    await inserDefaultSetting();
    await insertDefaultTemplateSetting();
    await inserDefaultVouchers();
    await inserDefaultBankUsers();
    await inserDefaultUsersCardsTypes();
    await inserDefaultBankAccountManager();
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
