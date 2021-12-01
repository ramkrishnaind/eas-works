const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    propertyType: Joi.string().required(),
    name: Joi.string().required(),
    mobile: Joi.number().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    propertyAddress: Joi.string().required(),
    propertyCity: Joi.string().required(),
    propertyState: Joi.string().required(),
    propertyLocation: Joi.string().required(),
    budget: Joi.number().required(),
    totalArea: Joi.number().required(),
    floor: Joi.string().required(),
    message: Joi.string().required()
});

function createServicesEnquiry(Models) {
    async function create(req, res) {
        try {

            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ["propertyType", "name", "mobile", "email", "address", "city",
                "state", "propertyAddress", "propertyCity", "propertyState", "propertyLocation", "budget",
                "totalArea", "floor", "message"]);

            bodyData.image = req.files;
            let saveModule = await new Models.ServiceEnquiryDB(bodyData).save();
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
module.exports = createServicesEnquiry;