import { getDatabase } from 'database/mongodb';

export const inserDefaultUsersValidations = async () => {

    // Fonction pour insérer les niveaux de validations par défaut des utilisateurs
    console.log('----------------------------------------');
    console.log('INSERT DEFAULT USERS VALIDATIONS');
    console.log('----------------------------------------');

    try {
        const db = await getDatabase();
        const users = await db.collection('users').find({ category: { $gte: 500 } }).toArray();

        const defaultValidation: any = {
            level: 1,
            enabled: true,
            fullRights: false,
        };

        const validators = [];

        for (const user of users) {
            if (['BCI001', 'BCI007'].includes(user?.userCode)) {
                defaultValidation.level = 2;
            }

            defaultValidation.userId = user?._id.toString();
            defaultValidation.email = user?.email;
            defaultValidation.tel = user?.tel;

            validators.push({ ...defaultValidation });
        }

        console.log('Insert default users validation  collection');

        // const collectionsExists = await db.listCollections({ name: 'visa_operations_validators' }).toArray();
        // console.log('collectionsExists', collectionsExists[0]?.name);

        // if (!isEmpty(collectionsExists)) {
        //     const respDelete = await db.collection("visa_operations_validators").drop();
        //     console.log('response delete', respDelete);
        // }

        const resp = await db.collection('visa_operations_validators').insertMany(validators);
        console.log('resp', resp);
    } catch (error) {
        console.error('An error occurred:', error);
    }
};