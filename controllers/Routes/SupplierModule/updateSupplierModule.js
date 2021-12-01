const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    companyName: Joi.string().required(),
    role: Joi.string().required(),
    mobile: Joi.number().required(),
    email: Joi.string(),
    location: Joi.string().required(),
    city: Joi.string().required(),
    supplierOf: Joi.string().required(),
    message: Joi.string()
});

function createSupplier(Models) {
    async function create(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["_id", "name", "companyName", "role", "mobile", "email", "location", "city", "supplierOf", "message"]);

            let setData = {
                name: bodyData.name,
                companyName: bodyData.companyName,
                role: bodyData.role,
                mobile: bodyData.mobile,
                email: bodyData.email,
                location: bodyData.location,
                city: bodyData.city,
                supplierOf: bodyData.supplierOf,
                message: bodyData.message
            }

            if (req.files.length > 0)
                setData.file = req.files;


            let updateModule = await Models.SupplierDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: "Supplier Info updated." });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return create;
}
module.exports = createSupplier;