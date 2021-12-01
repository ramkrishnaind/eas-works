const _ = require("lodash");
const Joi = require("joi");
const url = require("url");
const errorResponseHelper = require("../../../Helper/errorResponse");

const verificationSchema = Joi.object({
  token: Joi.string().required(),
});

function verificationHelper(Models) {
  async function verification(req, res) {
    try {
      //   let payload = req.body;
      const url_parts = url.parse(req.url, true);
      const query = url_parts.query;
      const { token } = query;
      // validate data using joi
      //   let validateData = verificationSchema.validate(payload);
      if (!token) {
        throw {
          status: false,
          error: validateData,
          message: "Invalid data",
          validationError: true,
        };
      }

      let userData = await Models.UserDB.findOneAndUpdate(
        { verificationToken: token, verified: false },
        {
          $set: { verificationDate: new Date(), verified: true },
        },
        { new: true }
      ).lean();
      // console.log('userData', userData, payload);
      if (!userData) {
        throw {
          status: false,
          error: true,
          message: "Invalid token",
          statusCode: 401,
        };
      }
      res.send({ status: true, message: "Successfully verified" });
    } catch (e) {
      console.log("verification err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Verification",
      });
    }
  }
  return verification;
}
module.exports = verificationHelper;
