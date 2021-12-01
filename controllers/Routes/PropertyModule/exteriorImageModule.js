const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

function exteriorImage(Models) {
    async function create(req, res) {
        try {

            const bodyData = {
                propertyId: req.body.propertyId,
            }
            console.log('req.body.imagetype is', req.body.imagetype, req.files)
            switch (req.body.imagetype) {
                case 'mainImage':
                    bodyData['mainImage'] = req.files;
                    break;
                case 'exteriorView':
                    bodyData['exteriorView'] = req.files;
                    break;
                case 'livingRoom':
                    bodyData['livingRoom'] = req.files;
                    break;
                case 'badrooms':
                    bodyData['badrooms'] = req.files;
                    break;
                case 'bathrooms':
                    bodyData['bathrooms'] = req.files;
                    break;
                case 'kitchen':
                    bodyData['kitchen'] = req.files;
                    break;
                case 'floorPlan':
                    bodyData['floorPlan'] = req.files;
                    break;
                case 'masterPlan':
                    bodyData['masterPlan'] = req.files;
                    break;
                case 'other':
                    bodyData['other'] = req.files;
                    break;
            }
            console.log('bodyData is', bodyData)
            let findDataname = await Models.PImageDB.findOne({ propertyId: req.body.propertyId });
            if (findDataname) {
                // if data found check 
                let updateModule = await Models.PImageDB.findOneAndUpdate({ propertyId: bodyData.propertyId }, { $set: bodyData });
                console.log('updateModule is', updateModule)
                res.send({ status: true, message: CONSTANTSMESSAGE.DATA_UPDATE_SUCCESS });
            }
            else {
                let saveModule = await new Models.PImageDB(bodyData).save();
                console.log('saveModule is', saveModule)
                res.send({ status: true, message: CONSTANTSMESSAGE.CREATE_SUCCESS_MESSAGE });
            }
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return create;
}
module.exports = exteriorImage;