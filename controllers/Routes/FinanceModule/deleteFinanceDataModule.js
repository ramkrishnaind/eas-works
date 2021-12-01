const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const deleteSchema = Joi.object({
    _id: Joi.string().trim().required()
});

function deleteFinanceData(Models) {
    async function deleteData(req, res) {
        try {
            let validateData = deleteSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Home from Database
            let deleteData = await Models.FinanceDB.remove({ _id: req.body._id });
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "Item Deleted Successfully." });
            } else {
                res.send({ status: false, message: "Item not found" });
            }
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting About Page Data" });
        }
    }
    return deleteData;
}

module.exports = deleteFinanceData;