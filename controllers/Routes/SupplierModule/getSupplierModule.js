const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const schema = Joi.object({
    _id: Joi.string().trim().required()
});

function getSupplierDetail(Models) {
    async function Details(req, res) {
        try {
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }
            let findData = await Models.SupplierDB.findOne({ _id: req.body._id }).lean();

            res.send({ status: true, message: "Supplier Details", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return Details;
}

module.exports = getSupplierDetail;