const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

const singlePropertyModuleSchema = Joi.object({
    propertyId: Joi.string().required()
});
const propertyLatLongSchema = Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required()
});
const propertyByTypeSchema = Joi.object({
    type: Joi.string().required(),
});

function getUserIdPropertyList(Models) {
    async function PropertyList(req, res) {
        try {
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["userId"]);
            let findData = await Models.PropertyDB.aggregate([
                {
                    $match: {
                        userId: bodyData.userId
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pfeatures',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'features'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pimages',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'images'
                    }
                }
            ]).sort({ updated: -1 });
            let obj = {
                total: findData.length,
                list: findData
            }

            res.send({ status: true, message: "", data: obj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return PropertyList;
}
function getAllPropertyForAdmin(Models) {
    async function PropertyList(req, res) {
        try {
            //console.log('req is', req)
            let LoginUser, myFavorite = [], allProperties = [];
            LoginUser = req.locals ? req.locals.user.userId._id : '';
            console.log('LoginUser', LoginUser)
            let findData = await Models.PropertyDB.aggregate([
                {
                    $lookup:
                    {
                        from: 'pfeatures',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'features'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pimages',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'images'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pprices',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'price'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'review'
                    }
                }
            ]).sort({ _id: -1 });
            console.log('LoginUser is ', LoginUser)
            if (LoginUser && LoginUser != '') {
                myFavorite = await Models.WishListDB.find({ userId: LoginUser }).lean();
            }
            console.log('myFavorite', myFavorite)
            //console.log('findData', findData)
            for (let x = 0; x < findData.length; x++) {
                let item = findData[x];
                //console.log('item is', item)
                let itemId = item._id;
                item.isFavorite = false;
                console.log('myFavorite is ', myFavorite.length, myFavorite)
                for (let y = 0; y < myFavorite.length; y++) {
                    let favItem = myFavorite[y];
                    let propertyId = favItem.propertyId;
                    console.log('propertyId is', propertyId)
                    console.log('itemId is', itemId)

                    if (itemId.toString() == propertyId.toString()) {
                        console.log('in if', itemId)
                        item.isFavorite = true;
                    }
                    //console.log('in else item item', item)
                }
                //item.isFavorite = false;
                allProperties.push(item);
            }
            //console.log('allProperties', allProperties)
            let obj = {
                total: allProperties.length,
                list: allProperties
            }

            res.send({ status: true, message: "", data: obj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return PropertyList;
}
function getAllProperty(Models) {
    async function PropertyList(req, res) {
        try {
            //console.log('req is', req)

            let LoginUser, myFavorite = [], allProperties = [];
            LoginUser = req.locals ? req.locals.user.userId._id : '';
            console.log('LoginUser', LoginUser)
            let findData = await Models.PropertyDB.aggregate([
                {
                    $match: { $and: [{ status: 1 }] },
                },
                {
                    $lookup:
                    {
                        from: 'pfeatures',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'features'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pimages',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'images'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pprices',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'price'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'review'
                    }
                }
            ]).sort({ _id: -1 });
            console.log('LoginUser is ', LoginUser)
            if (LoginUser && LoginUser != '') {
                myFavorite = await Models.WishListDB.find({ userId: LoginUser }).lean();
            }
            console.log('myFavorite', myFavorite)
            //console.log('findData', findData)
            for (let x = 0; x < findData.length; x++) {
                let item = findData[x];
                //console.log('item is', item)
                let itemId = item._id;
                item.isFavorite = false;
                console.log('myFavorite is ', myFavorite.length, myFavorite)
                for (let y = 0; y < myFavorite.length; y++) {
                    let favItem = myFavorite[y];
                    let propertyId = favItem.propertyId;
                    console.log('propertyId is', propertyId)
                    console.log('itemId is', itemId)

                    if (itemId.toString() == propertyId.toString()) {
                        console.log('in if', itemId)
                        item.isFavorite = true;
                    }
                    //console.log('in else item item', item)
                }
                //item.isFavorite = false;
                allProperties.push(item);
            }
            //console.log('allProperties', allProperties)
            let obj = {
                total: allProperties.length,
                list: allProperties
            }

            res.send({ status: true, message: "", data: obj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return PropertyList;
}
function getHomeAllProperty(Models) {
    async function PropertyList(req, res) {
        try {
            let LoginUser, myFavorite = [], allProperties = [];
            LoginUser = req.locals ? req.locals.user.userId._id : '';
            let findData = await Models.PropertyDB.aggregate([
                {
                    $match: { $and: [{ status: 1 }] },
                },
                {
                    $lookup: {
                        from: "pfeatures",
                        localField: "_id",
                        foreignField: "propertyId",
                        as: "features"
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pimages',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'images'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'pprices',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'price'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'propertyId',
                        as: 'review'
                    }
                }
            ]).sort({ _id: -1 });
            console.log('findData is', findData)
            if (LoginUser && LoginUser != '') {
                myFavorite = await Models.WishListDB.find({ userId: LoginUser }).lean();
            }
            console.log('myFavorite', myFavorite)
            //console.log('findData', findData)
            for (let x = 0; x < findData.length; x++) {
                let item = findData[x];
                //console.log('item is', item)
                let itemId = item._id;
                item.isFavorite = false;
                console.log('myFavorite is ', myFavorite.length, myFavorite)
                for (let y = 0; y < myFavorite.length; y++) {
                    let favItem = myFavorite[y];
                    let propertyId = favItem.propertyId;
                    console.log('propertyId is', propertyId)
                    console.log('itemId is', itemId)

                    if (itemId.toString() == propertyId.toString()) {
                        console.log('in if', itemId)
                        item.isFavorite = true;
                    }
                    //console.log('in else item item', item)
                }
                //item.isFavorite = false;
                allProperties.push(item);
            }
            //console.log('allProperties', allProperties)

            let rentData = allProperties.filter(function (item) {
                return item.for === "Rent";
            });
            let totalForRent = rentData.length;

            let sellData = allProperties.filter(function (item) {
                return item.for === "Sell";
            });
            let totalForSell = sellData.length;

            let constructionData = allProperties.filter(function (item) {
                return item.for === "Construction";
            });
            let totalForConstruction = constructionData.length;

            let interiorData = allProperties.filter(function (item) {
                return item.for === "Interior";
            });
            let totalForInterior = interiorData.length;
            let obj = {
                sell: {
                    total: totalForSell,
                    data: sellData
                },
                rent: {
                    total: totalForRent,
                    data: rentData
                },
                construction: {
                    total: totalForConstruction,
                    data: constructionData
                },
                interior: {
                    total: totalForInterior,
                    data: interiorData
                }
            }

            res.send({ status: true, message: "Properties Data for Home Page", data: obj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return PropertyList;
}
function propertyDetail(Models) {
    async function propertyDetailFun(req, res) {
        try {
            let LoginUser = req.locals ? req.locals.user.userId._id : '';

            let validateData = singlePropertyModuleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let property, isFavorite = false, isFavoriteData;
            let bodyData = _.pick(req.body, ["propertyId"]);
            let _id = bodyData.propertyId;
            let findData = await Models.PropertyDB.findOne({ _id }).lean();
            console.log("findData is", findData)
            if (findData) {
                let propertyFeaturesResponse = await Models.PFeaturesDB.findOne({ propertyId: findData._id }).lean();
                let propertyImagesResponse = await Models.PImageDB.findOne({ propertyId: findData._id }).lean();
                let propertyPriceResponse = await Models.PPriceDB.findOne({ propertyId: findData._id }).lean();
                let propertyReviewResponse = await Models.ReviewDB.find({ propertyId: findData._id }).sort({ _id: -1 }).lean();
                if (LoginUser && LoginUser != '') {
                    let favQuery = {
                        $and: [
                            { 'userId': LoginUser },
                            { 'propertyId': findData._id }
                        ]
                    };
                    isFavoriteData = await Models.WishListDB.find(favQuery).lean();
                }

                property = await Promise.all([propertyFeaturesResponse, propertyImagesResponse, propertyPriceResponse, propertyReviewResponse, isFavoriteData]).then(values => {
                    console.log(values);
                    let result = {};
                    let propertyFeatures = values[0];
                    let propertyImages = values[1];
                    let propertyPrice = values[2];
                    let propertyReview = values[3];
                    let favValue = values[4];
                    console.log('favValue is', favValue)
                    if (favValue && favValue.length) {
                        isFavorite = true;
                    }

                    console.log("propertyFeatures is", propertyFeatures)
                    console.log("propertyImages is", propertyImages)
                    console.log("propertyPrice is", propertyPrice)
                    console.log("propertyReview is", propertyReview)


                    let totalReviews = propertyReview.length;
                    let totalRatingSum = propertyReview.reduce(function (totalSum, currentValue) {
                        return totalSum + currentValue.rating;
                    }, 0);
                    let rating = totalRatingSum / totalReviews;
                    result._id = findData._id;
                    result.iAm = findData.iAm;
                    result.userName = '';
                    result.for = findData.for;
                    result.propertyCode = findData.propertyCode;
                    result.pType = findData.pType;
                    result.pCity = findData.pCity ? findData.pCity : propertyFeatures.address.city;
                    result.nameOfProject = findData.nameOfProject;
                    result.projectDescription = propertyFeatures.description;
                    result.postingAs = findData.postingAs;
                    result.created = findData.created;
                    result.bedrooms = propertyFeatures.bedrooms;
                    result.bathrooms = propertyFeatures.bathrooms;
                    result.balconies = propertyFeatures.balconies;
                    result.gaurdRoom = true;
                    result.floorNo = propertyFeatures.floorNo;
                    result.totalFloors = propertyFeatures.totalFloors;
                    result.furnishedStatus = propertyFeatures.furnishedStatus;
                    result.superArea = propertyFeatures.superArea;
                    result.builtUpArea = propertyFeatures.builtUpArea;
                    result.carpetArea = propertyFeatures.carpetArea;
                    result.transactionType = propertyFeatures.transactionType;
                    result.possessionStatus = propertyFeatures.possessionStatus;
                    result.availableFromMonth = propertyFeatures.availableFromMonth;
                    result.availableFromYear = propertyFeatures.availableFromYear;
                    result.buildYear = propertyFeatures.buildYear;
                    result.propertyTag = propertyFeatures.propertyTag;
                    result.ageOfConstruction = propertyFeatures.ageOfConstruction;
                    result.amenities = propertyFeatures.amenities;
                    result.propertyDetails = propertyFeatures.propertyDetails;
                    result.images = propertyImages;
                    result.rating = rating ? rating : 0;
                    result.review = propertyReview;
                    result.address = propertyFeatures.address;
                    result.price = propertyPrice;
                    result.vistorRoom = propertyFeatures.vistorRoom;
                    result.conferenceRoom = propertyFeatures.conferenceRoom;
                    result.meetingRooms = propertyFeatures.meetingRooms;
                    result.personalWashroom = propertyFeatures.personalWashroom;
                    result.Pantry = propertyFeatures.Pantry;
                    result.noOfSeats = propertyFeatures.noOfSeats;
                    result.Widthofroad = propertyFeatures.Widthofroad;
                    result.Noofopensides = propertyFeatures.Noofopensides;
                    result.isFavorite = isFavorite;
                    return result;
                });
                res.send({ status: true, message: "Property Details", data: property });
            } else {
                res.send({ status: true, message: "Property Note available.", data: findData });
            }


        }
        catch (e) {
            console.log('Getting Property Details err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting Property Details" });
        }
    }
    return propertyDetailFun;
}
function deleteProperty(Models) {
    async function deletePropertyFun(req, res) {
        try {
            let validateData = singlePropertyModuleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting User from Database
            let deleteData = await Models.PropertyDB.remove({ _id: req.body.propertyId });
            let deleteFeaturesData = await Models.PFeaturesDB.remove({ _id: req.body.propertyId });
            let deletePriceData = await Models.PPriceDB.remove({ _id: req.body.propertyId });
            let deleteImageData = await Models.PImageDB.remove({ _id: req.body.propertyId });
            console.log('deleteData is', deleteData)
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "Property Deleted Successfully" });
            } else {
                res.send({ status: true, message: "User not found" });
            }


        }
        catch (e) {
            console.log('createUserHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return deletePropertyFun;
}
function getPropertyLatLong(Models) {
    async function PropertyList(req, res) {
        try {
            let validateData = propertyLatLongSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["city", "state"]);
            let queryCity = bodyData.city.toLowerCase();
            let queryState = bodyData.state.toLowerCase();
            //let query = { "address.city": queryCity, "address.state": queryState };
            let query = {
                $or: [
                    { "address.city": queryCity },
                    { "address.state": queryState }
                ]
            };
            let data = await Models.PFeaturesDB.find(query).lean();
            console.log('data is', data)
            let resultData = [];
            if (data.length) {
                for (let x = 0; x < data.length; x++) {
                    let obj = {
                        latitude: data[x].address.latitude,
                        longitude: data[x].address.longitude
                    }
                    resultData.push(obj)
                }
            }
            let resultObj = { length: resultData.length, data: resultData }
            res.send({ status: true, message: "Properties Data for Home Page", data: resultObj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return PropertyList;
}
function getSearchTerms(Models) {
    async function cities(req, res) {
        try {

            let data = await Models.PFeaturesDB.distinct("address.city").sort();
            res.send({ status: true, message: "Cities data for filter", data });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return cities;
}
function getsearchMinMax(Models) {
    async function cities(req, res) {
        try {
            let minPrice = await Models.PPriceDB.aggregate(
                [
                    {
                        $group:
                        {
                            _id: {},
                            min: { $min: "$expectedPrice" }
                        }
                    }
                ]
            );
            let maxPrice = await Models.PPriceDB.aggregate(
                [
                    {
                        $group:
                        {
                            _id: {},
                            max: { $max: "$expectedPrice" }
                        }
                    }
                ]
            );
            let data = await Promise.all([minPrice, maxPrice]).then(values => {
                console.log(values[1]);
                let result = {};
                result.minAmount = values[0][0].min;
                result.maxAmount = values[1][0].max;
                console.log('values[0].min', values[0][0].min)
                console.log('values[1].max', values[1][0].max)
                console.log('result is', result)
                return result;
            });

            res.send({ status: true, message: "Properties Min and Max Values", data });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return cities;
}
function getPropertyByType(Models) {
    async function Type(req, res) {
        try {
            let validateData = propertyByTypeSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["type"]);
            console.log('bodyData', bodyData)
            console.log('bodyData.type', bodyData.type)
            if (bodyData.type == "RESIDENTIAL" || bodyData.type == "COMMERCIAL") {
                console.log('i am in out', bodyData.type)
                let data = await Models.PropertyDB.find({
                    $match: { $and: [{ status: 1 }, { pType: bodyData.type }] },
                }).sort({ _id: -1 }).lean();
                res.send({ status: true, message: "Property List.", data });
            } else {
                console.log('i am in if', bodyData.type)
                throw { status: false, error: true, message: "Property type must be 'RESIDENTIAL' or 'COMMERCIAL'" };
            }
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return Type;
}

module.exports = {
    getAllProperty,
    propertyDetail,
    deleteProperty,
    getHomeAllProperty,
    getPropertyLatLong,
    getSearchTerms,
    getsearchMinMax,
    getPropertyByType,
    getAllPropertyForAdmin
    // createUserFunc: createUserHelper,
    // getAllUserFunc: getAllUserHelper,
    // getUserFunc: getUserHelper,
    // updateUserStatusFun: updateUserStatusHelper,
    // deleteUserFunc: deleteUserHelper
};