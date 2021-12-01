const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

const moduleSchema = Joi.object({
    keyWord: Joi.string().empty(""),
    pageNo: Joi.number().integer().min(1),
    size: Joi.number().integer().min(1),
});

function getBookingList(Models) {
    async function BookingList(req, res) {
        try {
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }
            let bodyData = _.pick(req.body, ["keyWord", "pageNo", "size"]);
            let query = {};
            if (bodyData.keyWord && bodyData.keyWord !== '') {
                query = { 'name': { '$regex': bodyData.keyWord, '$options': 'i' } };
            }
            let findData = await Models.BookingDB.find(query).skip(bodyData.size * (bodyData.pageNo - 1))
                .limit(bodyData.size).sort({ _id: -1 }).populate("propertyId");

            let obj = {
                total: findData.length,
                list: findData
            }

            res.send({ status: true, message: "", data: obj.list, obj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return BookingList;
}

module.exports = getBookingList;