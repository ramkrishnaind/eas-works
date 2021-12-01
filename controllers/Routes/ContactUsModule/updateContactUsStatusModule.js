const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const schema = Joi.object({
    id: Joi.string().required(),
    isResolved: Joi.boolean().required()
});

function updateSliderStatus(Models) {
    async function update(req, res) {
        try {
            // validate data using joi
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            let bodyData = _.pick(req.body, ["isResolved", "id"]);
            let setData = {
                isResolved: bodyData.isResolved,
            }
            let updateModule = await Models.SliderDB.findOneAndUpdate({ _id: bodyData.id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS });
        }
        catch (e) {
            console.log('updateModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in updateModule" });
        }
    }
    return update;
}
module.exports = updateSliderStatus;