const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const schema = Joi.object({
    _id: Joi.string().required(),
});

function getServiceEnquiry(Models) {
    async function getFun(req, res) {
        try {
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting findData from Database
            let findData = await Models.ServiceEnquiryDB.findOne({ _id: req.body._id });
            console.log('findData is', findData)
            if (findData) {
                // if data found check verified or not
                res.send({ status: true, message: "Service Enquiry Details", data: findData });
            } else {
                res.send({ status: true, message: "Service Enquiry not found" });
            }


        }
        catch (e) {
            console.log('sliderData err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in sliderData" });
        }
    }
    return getFun;
}
module.exports = getServiceEnquiry;