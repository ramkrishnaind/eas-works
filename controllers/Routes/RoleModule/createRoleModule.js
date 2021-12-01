const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const CONSTANTSMESSAGE = require("../../../Helper/constantsMessage");
const errorResponseHelper = require("../../../Helper/errorResponse");
const moduleSchema = Joi.object({
  id: Joi.string().allow(null),
  name: Joi.string().required(),
  rights: Joi.array().required(),
  status: Joi.boolean().required(),
  //   createdBy: Joi.string().required(),
  //   updatedBy: Joi.string().required(),
});

function createUserRole(Models) {
  async function createRole(req, res) {
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
      let bodyData = _.pick(req.body, [
        "id",
        "name",
        "rights",
        "status",
        "createdBy",
        "updatedBy",
      ]);
      console.log(bodyData);
      let userRoleModule;
      if (bodyData.id != null) {
        let setData = {
          name: bodyData.name,
          rights: bodyData.rights,
          status: bodyData.status,
          updatedBy: bodyData.updatedBy,
        };
        userRoleModule = await Models.UserRoleDB.findOneAndUpdate(
          { _id: bodyData.id },
          { $set: setData },
          { new: true }
        ).lean();
        console.log(userRoleModule);
      } else {
        let findData = await Models.UserRoleDB.findOne({ name: bodyData.name });
        if (findData) {
          // if data found check
          throw {
            status: false,
            error: true,
            message: CONSTANTSMESSAGE.ALREADY_EXIST,
            duplicateMenuModule: true,
            statusCode: 401,
          };
        }
        userRoleModule = await new Models.UserRoleDB(bodyData).save();
        console.log("saveUserRoleModule is", userRoleModule);
      }

      res.send({ status: true, message: "", data: userRoleModule });
    } catch (e) {
      console.log("Getting menu list err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Getting Menu list",
      });
    }
  }
  return createRole;
}

module.exports = createUserRole;
