const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage');
const SendMessage = require('../../../Helper/sendSms');
const { template } = require('lodash');
const moduleSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required(),
    time: Joi.string().required()
});
const siteMobile = async (Models) => {
    let result = await Models.AddressDB.findOne({ active: true })
    console.log('result is', result)
    if (result) {
        return result.mobile;
    } else {
        return 9802953333;
    }
};
const sendMessageToClient = async (Models, bodyData) => {
    let clientMessage = 'Hello ' + bodyData.name + ', \n';
    let clientMobile = bodyData.phone;
    let mobile = await siteMobile(Models);
    clientMessage += 'Your Request Received For Site Visit. We will get back to you at the earliest For any query Call ' + mobile + ' \n';
    clientMessage += 'Regards, Vishal Construction Company VISHCC';
    console.log('clientMessage is', clientMessage);
    await SendMessage({
        senderID: 'VISHCC',
        templateID: '1207163549228584692',
        mobile: clientMobile,
        message: clientMessage,
    });
};
const sendMessageToAdmin = async (Models, bodyData) => {
    let mobile = await siteMobile(Models);
    let message = 'Hello Vishal Properties, \n';
    message += 'A New Request Received For Site Visit. \n';
    message += 'Name : ' + bodyData.name + ' \n';
    message += 'Mobile : ' + bodyData.phone + ' \n';
    message += 'Email : ' + bodyData.email + ' \n';
    message += 'Time : ' + bodyData.time + ' \n';
    message += 'Thanks \n';
    message += 'VISHCC';
    //let message = 'Hello, Vishal Propertie&nbsp; A New Request For Site Visit&nbsp;Name : ' + bodyData.name + '&nbsp;Mobile : ' + bodyData.phone + '&nbsp;Email : ' + bodyData.email + '&nbsp;Time ' + bodyData.time + 'Message By:- Dzone india.&nbsp;Thanks';
    console.log('message is', message);
    await SendMessage({
        senderID: 'VISHCC',
        templateID: '1207163549207674746',
        mobile,
        message
    });
};

function createSiteVisitRequest(Models) {
    async function create(req, res) {
        try {
            // console.log(req.sessionID)
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["name", "email", "phone", "time"]);

            let saveModule = await new Models.SiteVisitDB(bodyData).save();
            console.log('saveModule is', saveModule)
            if (saveModule) {
                await sendMessageToAdmin(Models, bodyData);
                await sendMessageToClient(Models, bodyData);
            }
            res.send({ status: true, message: CONSTANTSMESSAGE.CREATE_SUCCESS_MESSAGE });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return create;
}
module.exports = createSiteVisitRequest;