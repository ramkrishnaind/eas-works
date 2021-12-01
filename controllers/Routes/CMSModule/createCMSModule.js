const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    position: Joi.string().required(),
    pageName: Joi.string().allow(null),
    type: Joi.string().allow(null),
    pageUrl: Joi.string().allow(null),
    pageTitle: Joi.string().allow(null),
    metaTitle: Joi.string().allow(null),
    metaKeywords: Joi.string().allow(null),
    metaDescription: Joi.string().allow(null),
    pageSortDescription: Joi.string().allow(null),
    pageDescription: Joi.string().allow(null),
    image: Joi.string()
});

function createCMS(Models) {
    async function create(req, res) {
        try {

            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ["position", "pageName", "type", "pageUrl",
                "pageTitle", "metaTitle", "metaKeywords", "metaDescription", "pageSortDescription",
                "pageDescription", "image"]);
            let findData = await Models.CMSDB.findOne({ pageName: bodyData.pageName });

            if (findData) {
                // if data found check 
                throw { status: false, error: true, message: CONSTANTSMESSAGE.ALREADY_EXIST, duplicateModule: true, statusCode: 401 };
            }

            bodyData.image = req.files;

            let saveModule = await new Models.CMSDB(bodyData).save();
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
module.exports = createCMS;