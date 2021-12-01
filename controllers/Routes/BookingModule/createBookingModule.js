const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    propertyId: Joi.objectId().trim().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    panCard: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    pinCode: Joi.number().required(),
    bookingAmount: Joi.number().required(),
    flatNumber: Joi.string().required(),
    userId: Joi.objectId().trim().required(),
    tandc: Joi.boolean().required().allow(true),
});

function createBookingRequest(Models) {
    async function create(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["propertyId", "userId", "name", "email", "mobile", "panCard", "country", "state", "city", "pinCode","flatNumber", "bookingAmount"]);

            let saveModule = await new Models.BookingDB(bodyData).save();
            console.log('saveModule is', saveModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.CREATE_SUCCESS_MESSAGE });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return create;
}
module.exports = createBookingRequest;