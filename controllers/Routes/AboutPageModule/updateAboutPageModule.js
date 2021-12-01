const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleUpdateSchema = Joi.object({
    _id: Joi.objectId().trim().required(),
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string(),
    imagePosition: Joi.string().required()
});

function updateAboutPage(Models) {
    async function update(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = moduleUpdateSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ['_id', 'title', 'description', "imagePosition", 'metaTitle', 'metaKeywords', 'metaDescription']);

            let setData = {
                title: bodyData.title,
                description: bodyData.description,
                imagePosition: bodyData.imagePosition,
                metaTitle: bodyData.metaTitle,
                metaKeywords: bodyData.metaKeywords,
                metaDescription: bodyData.metaDescription
            }
            if (req.files.length > 0) {
                bodyData.image = req.files;
                setData['image'] = bodyData.image
            }
            let updateModule = await Models.AboutPageDB.findOneAndUpdate({ _id: bodyData.id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in update" });
        }
    }
    return update;
}
module.exports = updateAboutPage;