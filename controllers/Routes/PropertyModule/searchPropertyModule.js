const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

const moduleSchema = Joi.object({
    type: Joi.string().required(),
    keyword: Joi.string().empty(""),
    pType: Joi.string().empty(""),
    minAmount: Joi.number().empty(""),
    maxAmount: Joi.number().empty("")
});

function getSearchPropertyList(Models) {
    async function PropertyList(req, res) {
        try {
            let validateData = moduleSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let LoginUser, myFavorite = [], allProperties = [];
            LoginUser = req.locals ? req.locals.user.userId._id : '';
            let bodyData = _.pick(req.body, ["type", "keyword", "pType", "minAmount", "maxAmount"]);
            let Obj = [{ for: bodyData.type }, { status: 1 }]
            if (bodyData.pType != "")
                Obj.push({ pType: bodyData.pType })
            // if (bodyData.keyword != "")
            //     Obj.push({
            //         $or: [{ 'nameOfProject': { '$regex': bodyData.keyword, '$options': 'i' } },
            //         { 'pCity': { '$regex': bodyData.keyword, '$options': 'i' } },
            //         { 'locality': { '$regex': bodyData.keyword, '$options': 'i' } }]
            //     })


            let agQuery;
            console.log('min is ', bodyData.minAmount, ' max is', bodyData.maxAmount)
            if (bodyData.minAmount == 0 && bodyData.maxAmount == 0) {
                console.log('i am in if')
                agQuery = {
                    $match: { $and: Obj },
                }
            } else {
                console.log('i am in else')
                let pPriceQuery = { expectedPrice: { $gte: bodyData.minAmount, $lte: bodyData.maxAmount } };
                let propertyInRange = await Models.PPriceDB.find(pPriceQuery, {
                    propertyId: 1
                });
                const PropertyIds = propertyInRange.map((item) => item.propertyId);
                agQuery = {
                    $match: { $and: Obj, _id: { $in: PropertyIds } },
                }
            }
            //console.log('propertyInRange is', propertyInRange, PropertyIds)
            let findData = await Models.PropertyDB.aggregate([
                agQuery,
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
            ]).sort({ updated: -1 });
            if (LoginUser && LoginUser != '') {
                myFavorite = await Models.WishListDB.find({ userId: LoginUser }).lean();
            }
            for (let x = 0; x < findData.length; x++) {
                let item = findData[x];
                console.log('item is', item)
                let itemId = item._id;
                item.isFavorite = false;
                for (let y = 0; y < myFavorite.length; y++) {
                    let propertyId = myFavorite[y].propertyId;
                    console.log('propertyId is', propertyId)
                    console.log('itemId is', itemId)
                    if (itemId.toString() == propertyId.toString()) {
                        console.log('in if', itemId)
                        item.isFavorite = true;
                    }
                    console.log('in else item item', item)
                }
                //item.isFavorite = false;
                allProperties.push(item);
            }
            console.log('allProperties', allProperties)
            let obj = {
                total: findData.length,
                list: allProperties
            }

            res.send({ status: true, message: "Search Result", data: obj });
        }
        catch (e) {
            console.log('Getting list err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Getting list" });
        }
    }
    return PropertyList;
}

module.exports = getSearchPropertyList;