import { isEmpty } from 'lodash';
import { getDatabase } from '../config';
import moment from 'moment'
import { ObjectId } from 'mongodb';

export const inserDefaultUsersValidations = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS USERS VALIDATIONS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const users = await db.collection('users').find({ category: { $gte: 600 }, clientCode: { $in: ['', '', ''] } }).toArray();
    const opeValidation: any = {
        level: 1,
        enabled: true,
        fullRights: false,
    }

    for (const user of users) {
        if (user.clientCode === '') {
            opeValidation.level = 2;
        }
        opeValidation.userId = user?._id;
        opeValidation.email = user?.email;
        opeValidation.tel = user?.tel;
        const resp = await db.collection('users').updateOne({ _id: new ObjectId(user._id.toString()) }, { $set: { userValidator: { ...opeValidation } } });
        console.log('resp1', resp);
    }

};