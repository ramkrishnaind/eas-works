const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const getSchema = Joi.object({
    _id: Joi.string().trim().required()
});

function getAboutPageData(Models) {
    async function List(req, res) {
        try {
            let validateData = getSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }
            let findData = await Models.AboutPageDB.findOne({ _id: req.body._id });
            //findData.image = findData.image[0];

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