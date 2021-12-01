const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')

const errorResponseHelper = require('../../../Helper/errorResponse');

function getPropertyList(Models) {
  async function PropertyList(req, res) {
    try {
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
        }
      ]).sort({ _id: -1 });
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

module.exports = getPropertyList;