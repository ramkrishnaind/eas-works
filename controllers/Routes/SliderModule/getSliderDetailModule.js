const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const schema = Joi.object({
    _id: Joi.string().required(),
});

function getSider(Models) {
    async function getFun(req, res) {
        try {
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Slider from Database
            let sliderData = await Models.SliderDB.findOne({ _id: req.body._id });
            console.log('sliderData is', sliderData)
            if (sliderData) {
                // if data found check verified or not
                res.send({ status: true, message: "Slider Details", data: sliderData });
            } else {
                res.send({ status: true, message: "Slider not found" });
            }


        }
        catch (e) {
            console.log('sliderData err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in sliderData" });
        }
    }
    return getFun;
}
module.exports = getSider;