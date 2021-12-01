const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const menuModuleSchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.boolean().required(),
    description: Joi.string().required(),
    createdBy: Joi.objectId().required()
});

function createMenu(Models) {
    async function create(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = menuModuleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let topMenuCount = await Models.MenuModuleDB.countDocuments({ topParentID: null });


            let bodyData = _.pick(req.body, ['name', 'description', 'status', 'createdBy']);
            
                bodyData.level = topMenuCount + 1;
            // searching email or mobile already exists or not
            let findData = await Models.MenuModuleDB.findOne({ name: bodyData.name });
            if (findData) {
                // if data found check 
                throw { status: false, error: true, message: CONSTANTSMESSAGE.ALREADY_EXIST, duplicateMenuModule: true, statusCode: 401 };
            }

            let saveMenuModule = await new Models.MenuModuleDB(bodyData).save();
            console.log('saveMenuModule is', saveMenuModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.CREATE_SUCCESS_MESSAGE });
        }
        catch (e) {
            console.log('saveMenuModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveMenuModule" });
        }
    }
    return create;
}
module.exports = createMenu;