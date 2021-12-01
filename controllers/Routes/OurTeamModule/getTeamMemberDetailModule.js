const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const schema = Joi.object({
    _id: Joi.string().required(),
});

function getTeam(Models) {
    async function getFun(req, res) {
        try {
            let validateData = schema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Team from Database
            let TeamData = await Models.TeamDB.findOne({ _id: req.body._id });
            console.log('TeamData is', TeamData)
            if (TeamData) {
                // if data found check verified or not
                res.send({ status: true, message: "Team Member Details", data: TeamData });
            } else {
                res.send({ status: true, message: "Team Member not found" });
            }


        }
        catch (e) {
            console.log('TeamData err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in TeamData" });
        }
    }
    return getFun;
}
module.exports = getTeam;