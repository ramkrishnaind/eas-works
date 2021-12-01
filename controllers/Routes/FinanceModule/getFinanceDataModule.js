const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');


function getFinanceData(Models) {
    async function List(req, res) {
        try {
            let query = { active: true };
            let findData = await Models.FinanceDB.find(query).sort({ _id: -1 });

            res.send({ status: true, message: "", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting About Page Data" });
        }
    }
    return List;
}

module.exports = getFinanceData;