import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';

export const inserDefaultUsersCardsTypes = async () => {

    console.log('----------------------------------------');
    console.log('-------  INSERT DEFAULTS USER CARDS TYPES ------');
    console.log('----------------------------------------');

    const db = await getDatabase();

    const cartTypes = [
        {
            productCode: '185',
            label: "CARTE LEADER EMV ",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 300000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Paiement',
                    maxAmountPerDay: 500000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 5000,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 6000,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 7000,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 8000,
                },
            ],
        },
        {
            productCode: '186',
            label: "CARTE EXPRESS EMV",
            cardTypeTransactions: [
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 1000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 1000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 5000,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 6000,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 7000,
                },
            ],
        },
        {
            productCode: '',
            label: "GIMAC Express",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 300000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Paiement',
                    maxAmountPerDay: 500000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "GIMAC CONFORT",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 750000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "GIMAC MOOV",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 300000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Serenity",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 1000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 1000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 1000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 1000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Classic",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 1500000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 2000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 2000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 1500000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Gold",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 200000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 5000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 5000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 2000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Business",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 200000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 5000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 5000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 2000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Business Prem",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 400000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 10000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 10000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 5,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 4000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 5,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 5,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Platinum",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 400000,
                    frequency: 'week',
                    maxTransactionsPerDay: 10,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 12000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 10,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 12000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 10,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 4000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 10,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 10,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 10,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 30,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 30,
                    amount : 0,
                },
            ],
        },
        {
            productCode: '',
            label: "VISA Infinite",
            cardTypeTransactions: [
                {
                    label: 'Retrait',
                    maxAmountPerDay: 7000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 15,
                },
                {
                    label: 'Achat TPE',
                    maxAmountPerDay: 15000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 15,
                },
                {
                    label: 'E-Commerce',
                    maxAmountPerDay: 15000000,
                    frequency: 'month',
                    maxTransactionsPerDay: 15,
                },
                {
                    label: 'Cash Advance',
                    maxAmountPerDay: 7000000,
                    frequency: 'week',
                    maxTransactionsPerDay: 15,
                }
            ],
            profiles: [
                {
                    label: 'Profile 1 (100%)',
                    percentage: 100,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 2 (150%)',
                    percentage: 150,
                    maxTransactionsPerDay: 15,
                    amount : 0,
                },
                {
                    label: 'Profile 3 (200%)',
                    percentage: 200,
                    maxTransactionsPerDay: 45,
                    amount : 0,
                },
                {
                    label: 'Profile 4 (400%)',
                    percentage: 400,
                    maxTransactionsPerDay: 45,
                    amount : 0,
                },
            ],
        }  
    ]
    console.log('insert default cards types collection');

    const collectionsExists = await db.listCollections({name:'card-type'}).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("card-type").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('card-type').insertMany(cartTypes);
    console.log(response.insertedIds);
};