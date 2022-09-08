import { notificationService } from './notification.service';
import moment = require("moment");
import { config } from "../config";
import { decode, encode } from "./helpers/url-crypt/url-crypt.service.helper";
import * as helper from "./helpers/exports.helper";

export const reportingService = {


    getConsolidateData: async (fields: any) => {

        return {
            totalAmount: [
                {
                    type: 101,
                    total: 127
                },
                {
                    type: 102,
                    total: 12
                },
                {
                    type: 103,
                    total: 520
                },
                {
                    type: 104,
                    total: 271932650
                },
            ],
            statusAmount: [
                {
                    status: 200,
                    total: 48
                },
                {
                    status: 300,
                    total: 40
                },
                {
                    status: 400,
                    total: 39
                }
            ]
        };
    },

    getChartData: async (code: string) => {
        return {
            week: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                data: [12, 5, 25, 2, 5, 7, 6]
            },
            month: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                data: [2, 5, 1, 5, 2, 5, 5, 2, 6, 2, 2, 4, 3, 2, 4, 2, 3, 4, 3, 4, 5, 4, 6, 8, 4, 3, 9, 3, 1, 6, 1
                ]
            },
            year: {
                labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
                data: [10, 15, 20, 12, 13, 3, 3, 14, 15, 12, 3, 0]
            }
        };
    }
}
