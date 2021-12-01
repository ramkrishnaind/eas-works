const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');


function getFeedbackForHomeModule(Models) {
    async function Feedback(req, res) {
        try {
            let query = {};
            query = { status: true };
            let findData = await Models.FeedbackDB.find(query).sort({ _id: -1 }).populate("propertyId");
            if (findData.length) {
                res.send({ status: true, message: "Client Feedbacks", data: findData });
            } else {
                res.send({ status: true, message: "No Active Feedbacks Feedbacks", data: findData });
            }

        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return Feedback;
}

module.exports = getFeedbackForHomeModule;