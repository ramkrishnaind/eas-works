const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const errorResponseHelper = require('../../../Helper/errorResponse');

const getRoleDetailsSchema = Joi.object({
    _id: Joi.string().trim().required()
});

function userRoleList(Models) {
    async function updateRole(req, res) {
        try {
            let userRoleModule = await Models.UserRoleDB.aggregate([{
                $lookup: {
                    from: "users",
                    let: { order_item: "$_id", order_qty: "$createdBy" },
                    pipeline: [
                        { $project: { firstName: 1, _id: 1, lastName: 1 } }
                    ],
                    as: "createdByDetail"
                }
            },
            {
                $lookup: {
                    from: "menumodules",
                    let: { menu_id: "$_id", rights: "$rights" },
                    pipeline: [
                        { $project: { _id: 1, name: 1 } }
                    ],
                    as: "rightsName"
                }
            }])
            res.send({ status: true, message: "", data: userRoleModule });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return updateRole;
}
function userRoleDataList(Models) {
    async function getUserRoles(req, res) {
        try {
            let findData = await Models.UserRoleDB.find({}).select({ "name": 1, "_id": 1 }).sort({ created: -1 });
            res.send({ status: true, message: "Data Found", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return getUserRoles;
}
function userRoleDetails(Models) {
    async function userRoleDetails(req, res) {
        try {
            let validateData = getRoleDetailsSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }
            let findData = await Models.UserRoleDB.findOne({ _id: req.body._id });
            res.send({ status: true, message: "Data Found", data: findData });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return userRoleDetails;
}
function userRoleDelete(Models) {
    async function userRoleDelete(req, res) {
        try {
            let validateData = getRoleDetailsSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }
            let deleteData = await Models.UserRoleDB.remove({ _id: req.body._id });
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "Role Deleted Successfully" });
            } else {
                res.send({ status: true, message: "Role not found" });
            }
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Deleting" });
        }
    }
    return userRoleDelete;
}

module.exports = {
    userRoleList,
    userRoleDataList,
    userRoleDetails,
    userRoleDelete
};