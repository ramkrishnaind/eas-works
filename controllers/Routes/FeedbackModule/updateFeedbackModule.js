const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    city: Joi.string().required(),
    rating: Joi.number().required(),
    propertyId: Joi.string().allow('null'),
    message: Joi.string().required()
});

function updateFeedbackRequest(Models) {
    async function update(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["_id", "name", "rating", "city", "propertyId", "message"]);
            // searching email or mobile already exists or not
            // let findData = await Models.FeedbackDB.findOne({ email: bodyData.email });
            // if (findData) {
            //     // if data found check 
            //     throw { status: false, error: true, message: CONSTANTSMESSAGE.ALREADY_EXIST, duplicateModule: true, statusCode: 401 };
            // }
            bodyData.image = req.files;
            let setData = {
                name: bodyData.name,
                rating: bodyData.rating,
                city: bodyData.city,
                propertyId: bodyData.propertyId,
                message: bodyData.message,
            }
            let updateModule = await Models.FeedbackDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.UPDATE_SUCCESS_MESSAGE });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return update;
}
module.exports = updateFeedbackRequest;