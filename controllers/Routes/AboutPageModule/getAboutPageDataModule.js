const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');


function getAboutPageData(Models) {
    async function List(req, res) {
        try {
            let query = { active: true };
            let findData = await Models.AboutPageDB.find(query);

            res.send({ status: true, message: "", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting About Page Data" });
        }
    }
    return List;
}

module.exports = getAboutPageData;