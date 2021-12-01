const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')


function getDashBoardData(Models) {
    async function getFun(req, res) {
        try {
            let results = {
                users: {
                    total: 15,
                    active: 12,
                    inActive: 3
                },
                properties: {
                    sell: {
                        residential: 15,
                        commercial: 10
                    },
                    rent: {
                        residential: 20,
                        commercial: 5
                    }
                },
                booking: 100,
                enquiry: {
                    open: 51,
                    close: 12
                },
                siteVisit: {
                    open: 41,
                    close: 56
                },
                callBack: {
                    open: 56,
                    close: 25
                },
                contactWithUs: {
                    open: 45,
                    close: 56
                },
                jobApplications: {
                    open: 44,
                    close: 21
                },
                suppliers: {
                    open: 20,
                    close: 30
                },
                servicesEnquiry: {
                    open: 10,
                    close: 20
                }
            }
            res.send({ status: true, message: "Dashboard Details", data: results });


        }
        catch (e) {
            console.log('Dashboard Details err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Dashboard Details" });
        }
    }
    return getFun;
}
module.exports = getDashBoardData;