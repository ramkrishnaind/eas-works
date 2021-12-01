const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const menuModuleSchema = Joi.object({
    userRole: Joi.array().required()
});

function getMenuList(Models)
{
    async function menuList(req, res) {
        try {
            let validateData = menuModuleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ['userRole']);
            let findData = await Models.MenuModuleDB.find({'name': {$in:bodyData.userRole}});            
            res.send({ status: true, message: "", data:findData });
        }
        catch (e) {
            console.log('Getting menu list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting Menu list" });
        }
    }
    return menuList;
}

module.exports = getMenuList;