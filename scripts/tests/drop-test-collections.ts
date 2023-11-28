import { getDatabase } from '../../src/database/mongodb';

export const dropTestCollections = async () => {

    console.log('----------------------------------------');
    console.log('-------  DROPPING TEST COLLECTIONS  ------');
    console.log('----------------------------------------');

    const db = await getDatabase();


    const respDelete = await db.collection("settings").deleteMany({ key: { $in: ['visa_transaction_tmp_treatment_in_progress', 'start_revival_mail_in_progress', 'get_internet_pay_transactions_in_progress', 'get_tpe_gab_transactions_in_progress'] } });
    console.log('settings delete', respDelete);

    const collections = ['visa_transactions_tmp', 'visa_transactions_replica', 'visa_transactions', 'visa_transactions', 'visa_operations_travels', 'visa_operations_travel_months', 'visa_operations_online_payments', 'queue', 'notifications']

    await Promise.all(collections.map(async (collection) => {
        try {
            const response = await db.dropCollection(collection);
            return response;

        } catch (error) {
            console.log('error', error);
            return error;

        }
    }));
}
