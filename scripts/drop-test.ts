
import { config } from './config-env';
import Confirm from 'prompt-confirm';
import { dropTestCollections } from './tests/drop-test-collections';

const runScripts = async () => {
    // SCRIPTS to execute

    await dropTestCollections();
 
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


