const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

const moduleSchema = Joi.object({
    _id: Joi.string().required(),
});

function getFeedback(Models) {
    async function Feedback(req, res) {
        try {
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }
            let bodyData = _.pick(req.body, ["_id"]);
            let findData = await Models.FeedbackDB.findOne({ _id: bodyData._id }).lean();

            res.send({ status: true, message: "Feedback Found", data: findData });
        }
        catch (e) {
            console.log('Getting err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting" });
        }
    }
    return Feedback;
}

module.exports = getFeedback;