const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

function getCMSPages(Models, type) {
    async function Pages(req, res) {
        try {
            let findData = await Models.CMSDB.find({ position: type }).lean();
            res.send({ status: true, message: "CMS " + type + " Pages.", data: findData });
        }
        catch (e) {
            console.log('Getting Pages err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting Pages" });
        }
    }
    return Pages;
}

module.exports = getCMSPages;