const _ = require("lodash");
const Joi = require("joi");
const path = require("path");
const createTokenFunction = require("../../../Helper/createUniqueToken");
const prepareTemplateAndMailHelper = require("../../../Helper/prepareTemplateAndMail");
const smsHelper = require("../../../Helper/sendSms");
const errorResponseHelper = require("../../../Helper/errorResponse");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

async function prepareTemplateSendMail(data) {
  try {
    let filePath = path.join(
      __dirname,
      "/../../../Template/forgotPasswordAuth.html"
    );
    let replacements = {
      name: `${_.capitalize(data.firstName)} ${data.lastName}`,
      username: data.email,
      authenticationLink: `${process.env.APP_URL}/setnewpassword?token=${data.forgetPasswordToken}`,
    };
    let info = await prepareTemplateAndMailHelper({
      filePath,
      replacements,
      to: data.email,
      subject: "Password Change Request",
    });
    return info;
  } catch (e) {
    console.log("error", e);
  }
}

function forgotPasswordHelper(Models) {
  async function forgotPassword(req, res) {
    try {
      // console.log(req.sessionID)
      let payload = req.body;
      // validate data using joi
      let validateData = forgotPasswordSchema.validate(payload);
      if (validateData.error) {
        throw {
          status: false,
          error: validateData,
          message: "Invalid data",
          validationError: true,
        };
      }

      payload.email = String(payload.email).trim().toLowerCase();
      let hash = await createTokenFunction(payload.email);
      let userData = await Models.UserDB.findOneAndUpdate(
        { email: payload.email },
        {
          $set: {
            forgetPasswordToken: hash,
          },
        },
        { new: true }
      ).lean();

      if (!userData) {
        throw {
          status: false,
          error: true,
          message: "Email not found",
          statusCode: 404,
          notFound: true,
        };
      }
      prepareTemplateSendMail(userData);
      res.send({
        status: true,
        message: "Verification mail has been sent to your registered email",
        mailSent: true,
      });
    } catch (e) {
      console.log("forgotPassword err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Forgot Password",
      });
    }
  }
  return forgotPassword;
}
module.exports = forgotPasswordHelper;
