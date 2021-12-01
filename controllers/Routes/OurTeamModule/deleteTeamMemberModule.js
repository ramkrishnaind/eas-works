const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const schema = Joi.object({
    _id: Joi.string().required(),
});

function deleteTeam(Models) {
    async function deleteFun(req, res) {
        try {
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Team from Database
            let deleteData = await Models.TeamDB.remove({ _id: req.body._id });
            console.log('deleteData is', deleteData)
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "Team Member Deleted Successfully" });
            } else {
                res.send({ status: true, message: "Team Member not found" });
            }


        }
        catch (e) {
            console.log('createTeamHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return deleteFun;
}
module.exports = deleteTeam;