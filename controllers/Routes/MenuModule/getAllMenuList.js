const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');
const menuModuleSchema = Joi.object({
    userRole: Joi.array().required()
});

function getAllMenuList(Models)
{
    async function menuList(req, res) {
        try {
            
            let findData = await Models.MenuModuleDB.find();            
            res.send({ status: true, message: "All Menu List is", data:findData });
        }
        catch (e) {
            console.log('Getting menu list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting Menu list" });
        }
    }
    return menuList;
}

module.exports = getAllMenuList;