const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    propertyId: Joi.string().required(),
    expectedPrice: Joi.number(),
    tokenAmount: Joi.number(),
    pricePerSqft: Joi.number(),
    priceIncludes: Joi.array(),
    otherCharges: Joi.number(),
    wishToEnter: Joi.string().empty(""),
    basicPrice: Joi.number(),
    floorPLC: Joi.number(),
    facingPLC: Joi.number(),
    openCarParking: Joi.number(),
    openCarParkingFree: Joi.boolean(),
    coveredCarParking: Joi.number(),
    coveredCarParkingFree: Joi.boolean(),
    newComponent: Joi.string().empty(""),
    taxRegistration: Joi.boolean(),
    maintenanceCharges: Joi.number(),
    per: Joi.string().empty(""),
    brokerage: Joi.number()
});



function updatePrice(Models) {
    async function create(req, res) {
        try {
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ["propertyId", "expectedPrice", "tokenAmount", "pricePerSqft", "priceIncludes",
                "otherCharges", "wishToEnter", "basicPrice", "floorPLC", "facingPLC", "openCarParking", "openCarParkingFree",
                "coveredCarParking", "coveredCarParkingFree", "newComponent", "taxRegistration", "maintenanceCharges",
                "per", "brokerage"]);

            let findData = await Models.PPriceDB.findOne({ propertyId: bodyData.propertyId });

            if (findData) {

                let setData = {
                    propertyId: bodyData.propertyId,
                    expectedPrice: bodyData.expectedPrice,
                    tokenAmount: bodyData.tokenAmount,
                    pricePerSqft: bodyData.pricePerSqft,
                    priceIncludes: bodyData.priceIncludes,
                    otherCharges: bodyData.otherCharges,
                    wishToEnter: bodyData.wishToEnter,
                    basicPrice: bodyData.basicPrice,
                    floorPLC: bodyData.floorPLC,
                    facingPLC: bodyData.facingPLC,
                    openCarParking: bodyData.openCarParking,
                    openCarParkingFree: bodyData.openCarParkingFree,
                    coveredCarParking: bodyData.coveredCarParking,
                    coveredCarParkingFree: bodyData.coveredCarParkingFree,
                    newComponent: bodyData.newComponent,
                    taxRegistration: bodyData.taxRegistration,
                    maintenanceCharges: bodyData.maintenanceCharges,
                    per: bodyData.per,
                    brokerage: bodyData.brokerage
                };
                let saveModule = await Models.PropertyDB.findOneAndUpdate({ _id: bodyData.propertyId }, { $set: setData });
                console.log('saveModule is', saveModule)
                res.send({ status: true, message: CONSTANTSMESSAGE.DATA_UPDATE_SUCCESS });
            }
            else {
                let saveModule = await new Models.PPriceDB(moduleFeatureSchema).save();
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
module.exports = updatePrice;