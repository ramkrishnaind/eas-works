const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const { required } = require('joi');

const moduleSchema = Joi.object({
    _id: Joi.string().required(),
});

function getCMS(Models) {
    async function details(req, res) {
        try {
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }
            let bodyData = _.pick(req.body, ["_id"]);
            let _id = bodyData._id;
            let findData = await Models.CMSDB.findOne({ _id }).lean();
            res.send({ status: true, message: "CMS Details", data: findData });
        }
        catch (e) {
            console.log('Getting Details err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting Details" });
        }
    }
    return details;
}

module.exports = getCMS;