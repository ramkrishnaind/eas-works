const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    designation: Joi.string(),
    shortDescription: Joi.string(),
    description: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string(),
    instagram: Joi.string(),
    linkedin: Joi.string(),
});

function updateTeam(Models) {
    async function update(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["_id", "name", "designation", "shortDescription", "description", "facebook", "twitter", "instagram", "linkedin"]);

            let setData = {
                name: bodyData.name,
                designation: bodyData.designation,
                shortDescription: bodyData.shortDescription,
                description: bodyData.description,
                facebook: bodyData.facebook,
                twitter: bodyData.twitter,
                instagram: bodyData.instagram,
                linkedin: bodyData.linkedin
            }
            if (req.files.length > 0) {
                bodyData.image = req.files;
                setData['image'] = bodyData.image
            }
            let updateModule = await Models.TeamDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: "Team Member Updated Successfully." });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return update;
}
module.exports = updateTeam;