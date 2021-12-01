const _ = require("lodash");
// const ObjectId = mongoose.Types.ObjectId;
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const CONSTANTSMESSAGE = require("../../../Helper/constantsMessage");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const errorResponseHelper = require("../../../Helper/errorResponse");

const moduleSchema = Joi.object({
  userId: Joi.objectId().required(),
});

function getUserIdPropertyList(Models) {
  async function PropertyList(req, res) {
    try {
      let validateData = moduleSchema.validate(req.body);
      if (validateData.error) {
        throw {
          status: false,
          error: validateData,
          message: CONSTANTSMESSAGE.INVALID_DATA,
        };
      }

      // pick data from req.body

      let bodyData = _.pick(req.body, ["userId"]);
      let findData = await Models.PropertyDB.aggregate([
        {
          $match: {
            userId: ObjectId(bodyData.userId),
          },
        },
        {
          $lookup: {
            from: "pfeatures",
            localField: "_id",
            foreignField: "propertyId",
            as: "features",
          },
        },
        {
          $lookup: {
            from: "pimages",
            localField: "_id",
            foreignField: "propertyId",
            as: "images",
          },
        },
        {
          $lookup: {
            from: "pprices",
            localField: "_id",
            foreignField: "propertyId",
            as: "price",
          },
        },
      ]).sort({ _id: -1 });
      let obj = {
        total: findData.length,
        list: findData,
      };

      res.send({ status: true, message: "", data: obj });
    } catch (e) {
      console.log("Getting list err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Getting list",
      });
    }
  }
  return PropertyList;
}

module.exports = getUserIdPropertyList;
