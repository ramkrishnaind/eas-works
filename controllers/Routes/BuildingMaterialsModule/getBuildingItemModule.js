const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const schema = Joi.object({
    _id: Joi.string().trim().required()
});

function getBuildingItem(Models) {
    async function item(req, res) {
        try {
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }
            let findData = await Models.BuildingDB.findOne({ _id: req.body._id }).lean();

            res.send({ status: true, message: "Building Item Details", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return item;
}

module.exports = getBuildingItem;