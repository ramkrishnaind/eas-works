const _ = require('lodash');
const Joi = require('joi');
const path = require('path');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage');
const sendSupplierMailHelper = require('../../../Helper/sendSupplierMailHelper');

const moduleSchema = Joi.object({
    name: Joi.string().required(),
    companyName: Joi.string().required(),
    role: Joi.string().required(),
    mobile: Joi.number().required(),
    email: Joi.string(),
    location: Joi.string().required(),
    city: Joi.string().required(),
    supplierOf: Joi.string().required(),
    message: Joi.string()
});
async function prepareTemplateSendMail(data) {
    try {
        let filePath = path.join(__dirname, '/../../../Template/suppliersMail.html');
        let replacements = {
            name: `${_.capitalize(data.name)}`,
            companyName: `${_.capitalize(data.companyName)}`,
            role: `${_.capitalize(data.role)}`,
            mobile: data.mobile,
            email: data.email,
            location: `${_.capitalize(data.location)}`,
            city: `${_.capitalize(data.city)}`,
            supplierOf: `${_.capitalize(data.supplierOf)}`,
            message: data.message
        }
        console.log('file is ', data.file)
        let attachments = [];
        let apiUrl = 'https://api.vishalconstructioncompany.com/'
        for (let x = 0; x < data.file.length; x++){
            let item = data.file[x]
            let obj = {};
            obj.path = apiUrl + item.path ;
            attachments. push(obj);
        }
        //let info = await prepareTemplateAndMailHelper({ filePath, replacements, to: data.email, subject: "New Supplier Request For VCC" });
        let info = await sendSupplierMailHelper({ filePath, replacements, to: "info@vishalconstructioncompany.com", subject: "New Supplier Request For VCC", attachments, from: data.email });
        return info;
    }
    catch (e) {
        console.log('error', e);
    }
}

function createSupplier(Models) {
    async function create(req, res) {
        try {

            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ["name", "companyName", "role", "mobile", "email", "location", "city", "supplierOf", "message"]);

            if (req.files.length > 0)
                bodyData.file = req.files;

            let saveModule = await new Models.SupplierDB(bodyData).save();
            console.log('saveModule is', saveModule)
            await prepareTemplateSendMail(bodyData);
            res.send({ status: true, message: CONSTANTSMESSAGE.CREATE_SUCCESS_MESSAGE });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return create;
}
module.exports = createSupplier;