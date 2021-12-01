const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

function getBuildingMaterials(Models) {
    async function List(req, res) {
        try {
            let findData = await Models.BuildingDB.find({ isDisable: false }).sort({ _id: -1 });

            res.send({ status: true, message: "", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return List;
}

module.exports = getBuildingMaterials;