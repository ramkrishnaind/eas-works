const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const SendMessage = require('../../../Helper/sendSms');
const siteMobile = async (Models) => {
    let result = await Models.AddressDB.findOne({ active: true })
    console.log('result is', result)
    if (result) {
        return result.mobile;
    } else {
        return 9802953333;
    }
};
const clientMobile = async (Models, bodyData) => {
    let _id = bodyData.userId;
    let result = await Models.UserDB.findOne({ _id })
    console.log('result is', result)
    if (result) {
        let user = {
            mobile: result.mobile,
            firstName: result.firstName,
            lastName: result.lastName
        }
        return user;
    } else {
        return { mobile: 9802953333 };
    }
};
const sendMessageToClient = async (Models, bodyData) => {
    let clientDetails = await clientMobile(Models, bodyData);
    console.log('clientDetails is', clientDetails)
    let clientMessage = 'Hello ' + clientDetails.firstName + ' ' + clientDetails.lastName + ', \n';
    clientMessage += 'Your Property ' + bodyData.nameOfProject + ', Property Code:- ' + bodyData.propertyCode + ' submitted on Vishal Construction Company for approval, We will verify your request and revert you soon. Regards, Vishal Construction Company VISHCC \n';
    console.log('clientMessage is', clientMessage);
    let msgObj = {
        senderID: 'VCCFLT',
        templateID: '1207163549248717951',
        mobile: clientDetails.mobile,
        message: clientMessage,
    };
    await SendMessage(msgObj);
};
const sendMessageToAdmin = async (Models, bodyData) => {
    let mobile = await siteMobile(Models);
    let message = 'Hello Vishal Properties, \n';
    message += 'A VCC User ' + bodyData.name + ', want to contact. Subject: ' + bodyData.subject + ' Name : ' + bodyData.name + ' Mobile : ' + bodyData.mobile + ' Email : ' + bodyData.email + ' Message: ' + bodyData.message + ' Thanks VISHCC';
    console.log('message is', message);
    await SendMessage({
        senderID: 'VCCFLT',
        templateID: '1207163549238877518',
        mobile,
        message
    });
};

const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const moduleSchema = Joi.object({
    iAm: Joi.string().required(),
    for: Joi.string().empty(""),
    pType: Joi.string().empty(""),
    postingAs: Joi.string().empty(""),
    nameOfProject: Joi.string().empty(""),
    bedrooms: Joi.number().allow(null),
    balconies: Joi.number().allow(null),
    floorNo: Joi.number().allow(null),
    totalFloors: Joi.number().allow(null),
    furnishedStatus: Joi.string(),
    bathrooms: Joi.number().allow(null),
    superArea: Joi.number().allow(null),
    builtUpArea: Joi.number().allow(null),
    carpetArea: Joi.number().allow(null),
    possessionStatus: Joi.string().empty(""),
    availableFromMonth: Joi.number().allow(null),
    availableFromYear: Joi.number().allow(null),
    buildYear: Joi.number().allow(null),
    ageOfConstruction: Joi.string().empty(""),
    expectedPrice: Joi.number().allow(null),
    pricePerSqFt: Joi.number().allow(null),
    otherCharges: Joi.number().allow(null),
    isStumpDutyRCExcluded: Joi.boolean(),
    bookingAmount: Joi.number().allow(null),
    maintenanceCharge: Joi.number().allow(null),
    maintenanceFor: Joi.string(),
    brokerageCharge: Joi.number().allow(null),
    amenities: Joi.array(),
    latitude: Joi.string(),
    longitude: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    State: Joi.string(),
    pinCode: Joi.string(),
    propertyTag: Joi.string(),
    transactionType: Joi.string(),
    propertyDetails: Joi.array(),
    isPostedByAdmin: Joi.boolean(),
    userId: Joi.objectId(),
    totalArea: Joi.number().allow(null),
    propertyTag: Joi.string(),
    gaurdRoom: Joi.boolean(),
    description: Joi.string(),

    conferenceRoom: Joi.number().allow(null),
    vistorRoom: Joi.number().allow(null),
    personalWashroom: Joi.boolean(),
    noOfSeats: Joi.number().allow(null),
    meetingRooms: Joi.number().allow(null),
    Pantry: Joi.boolean(),
    Noofopensides: Joi.number().allow(null),
    Widthofroad: Joi.number().allow(null),
    IsCornerPlot: Joi.boolean(),
});



function createPropertyRequest(Models) {
    async function create(req, res) {
        try {
            // validate data using joi
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ["iAm", "for", "pType", "postingAs", "pCity", "nameOfProject",
                "bedrooms", "balconies", "floorNo", "totalFloors", "furnishedStatus", "bathrooms", "superArea",
                "builtUpArea", "carpetArea", "transactionType", "possessionStatus", "availableFromMonth",
                "availableFromYear", "ageOfConstruction", "expectedPrice", "pricePerSqFt", "isPLCIncluded",
                "isCarParkingIncluded", "isClubMemberShipIncluded", "otherCharges", "isStumpDutyRCExcluded",
                "bookingAmount", "maintenanceCharge", "maintenanceFor", "brokerageCharge", "amenities", "latitude",
                "longitude", "address", "city", "State", "pinCode", "propertTag", "isPostedByAdmin", "propertyDetails",
                "userId", "totalArea", "propertyTag", "gaurdRoom", "description", "buildYear", "conferenceRoom", "vistorRoom",
                "personalWashroom", "noOfSeats", "meetingRooms", "Pantry", "Noofopensides", "Widthofroad", "IsCornerPlot"]);
            // searching email or mobile already exists or not
            let propertiesLength = await Models.PropertyDB.count();
            let code = propertiesLength + 1;
            bodyData.propertyCode = "VP" + code;
            if (bodyData.isPostedByAdmin) {
                bodyData.status = 1;
            } else {
                bodyData.status = 5;
            }
            const moduleFeatureSchema = {
                bedrooms: bodyData.bathrooms,
                balconies: bodyData.balconies,
                floorNo: bodyData.floorNo,
                totalFloors: bodyData.totalFloors,
                furnishedStatus: bodyData.furnishedStatus,
                bathrooms: bodyData.bathrooms,
                totalArea: bodyData.totalArea,
                superArea: bodyData.superArea,
                builtUpArea: bodyData.builtUpArea,
                carpetArea: bodyData.carpetArea,
                transactionType: bodyData.transactionType,
                possessionStatus: bodyData.possessionStatus,
                availableFromMonth: bodyData.availableFromMonth,
                availableFromYear: bodyData.availableFromYear,
                buildYear: bodyData.buildYear,
                ageOfConstruction: bodyData.ageOfConstruction,
                amenities: bodyData.amenities,
                propertTag: bodyData.propertTag,
                description: bodyData.description,
                address: {
                    latitude: bodyData.latitude,
                    longitude: bodyData.longitude,
                    address: bodyData.address.toLowerCase(),
                    city: bodyData.city.toLowerCase(),
                    State: bodyData.State.toLowerCase(),
                    pinCode: bodyData.pinCode
                },
                pCity: bodyData.city,
                locality: bodyData.locality,
                status: bodyData.status,
                propertyDetails: bodyData.propertyDetails,
                propertyTag: bodyData.propertyTag,
                userId: bodyData.userId,
                gaurdRoom: bodyData.gaurdRoom,
                conferenceRoom: bodyData.conferenceRoom,
                vistorRoom: bodyData.vistorRoom,
                personalWashroom: bodyData.personalWashroom,
                noOfSeats: bodyData.noOfSeats,
                meetingRooms: bodyData.meetingRooms,
                Pantry: bodyData.Pantry,
                Noofopensides: bodyData.Noofopensides,
                Widthofroad: bodyData.Widthofroad,
                IsCornerPlot: bodyData.IsCornerPlot,
                visitorRoom: bodyData.visitorRoom
            };
            const priceSchema = {
                expectedPrice: bodyData.expectedPrice,
                pricePerSqft: bodyData.pricePerSqFt,
                otherCharges: bodyData.otherCharges,
                isStumpDutyRCExcluded: bodyData.isStumpDutyRCExcluded,
                bookingAmount: bodyData.bookingAmount,
                maintenanceCharge: bodyData.maintenanceCharge,
                maintenanceFor: bodyData.maintenanceFor,
                brokerage: bodyData.brokerageCharge,
            };
            let saveModule = await new Models.PropertyDB(bodyData).save();
            moduleFeatureSchema.propertyId = saveModule._id;
            priceSchema.propertyId = saveModule._id;
            console.log("priceSchema before saving", priceSchema);
            let featureSchemaModule = await new Models.PFeaturesDB(moduleFeatureSchema).save();
            console.log('saveModule is', featureSchemaModule)
            let priceSchemaModule = await new Models.PPriceDB(priceSchema).save();

            console.log('priceSchemaModule at saving time', priceSchemaModule)
            if (featureSchemaModule) {
                //await sendMessageToAdmin(Models, bodyData);
                await sendMessageToClient(Models, bodyData);
            }
            res.send({ status: true, propertyId: saveModule._id, message: CONSTANTSMESSAGE.CREATE_SUCCESS_MESSAGE });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in saveModule" });
        }
    }
    return create;
}
module.exports = createPropertyRequest;