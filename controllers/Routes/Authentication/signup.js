const _ = require("lodash");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Joi = require("joi");
const path = require("path");
const bcrypt = require("bcryptjs");
const createTokenFunction = require("../../../Helper/createUniqueToken");
const prepareTemplateAndMailHelper = require("../../../Helper/prepareTemplateAndMail");
const errorResponseHelper = require("../../../Helper/errorResponse");

const signUpSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
  // mobile: Joi.number().required(),
  // countryCode: Joi.number(),
  userRole: Joi.string().required(),
});

async function prepareTemplateSendMail(data) {
  try {
    let filePath = path.join(
      __dirname,
      "/../../../Template/userAuthentication.html"
    );
    console.log("SERVER_URL", process.env.SERVER_URL);
    let replacements = {
      name: `${_.capitalize(data.firstName)} ${data.lastName}`,
      username: data.email,
      token: data.verificationToken,
      authenticationLink: `${process.env.SERVER_URL}/api/users/verification?token=${data.verificationToken}`,
    };
    let info = await prepareTemplateAndMailHelper({
      filePath,
      replacements,
      to: data.email,
      subject: "Authentication",
    });
    return info;
  } catch (e) {
    console.log("error", e);
  }
}
// prepareTemplateSendMail({ firstName: "tek", lastName: "thapa", email: "tekbahadur1996@gmail.com", verificationToken: "THIS_IS_TOKEN"}).then(x => {
//     console.log('then',x);
// });

function signUpHelper(Models) {
  async function signUp(req, res) {
    try {
      // console.log(req.sessionID)
      // validate data using joi
      // let validateData = signUpSchema.validate(req.body);
      // if (validateData.error) {
      //     throw { status: false, error: validateData, message: "Invalid data" };
      // }

      // pick data from req.body
      let userData = _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        // "mobile",
        // "countryCode",
        "userRole",
      ]);

      // setting email to lowercase
      userData.email = String(userData.email).trim().toLowerCase();

      // searching email or mobile already exists or not
      let findData = await Models.UserDB.findOne({
        // $or: [{ email: userData.email }, { mobile: userData.mobile }],
        email: userData.email,
      });
      if (findData) {
        // if data found check verified or not
        if (!findData.verified) {
          // user is not verified then send verification email again
          prepareTemplateSendMail(findData);
          throw {
            status: false,
            error: true,
            message: "Please verify your account",
            notVerified: true,
            mailSent: true,
            statusCode: 401,
          };
        }
        // if not active, ie disabled by admin
        if (!findData.active) {
          throw {
            status: false,
            error: true,
            message: "Your account has been disabled. Please contact admin",
            adminDisable: true,
            statusCode: 401,
          };
        }

        throw {
          status: false,
          error: true,
          message: "Account already exists",
          duplicateAccount: true,
          statusCode: 401,
        };
      }

      // creating unique token
      let hash = await createTokenFunction(userData.email);
      userData.verificationToken = hash;
      userData.password = bcrypt.hashSync(userData.password, 10);
      let findRole = await Models.UserRoleDB.findOne({
        // $or: [{ email: userData.email }, { mobile: userData.mobile }],
        name: userData.userRole,
      });

      userData.userRole = findRole._id;
      let saveUser = await new Models.UserDB(userData).save();

      // now send mail
      prepareTemplateSendMail(saveUser);
      let authenticationLink = `${process.env.SERVER_URL}/api/users/verification?token=${hash}`;
      // "http://localhost:3000/api/users"
      // }/verificationdata.verificationToken`;

      res.send({
        status: true,
        message: "Verification mail has been sent to your registered email",
        result: {
          mailSent: true,
        },
      });
    } catch (e) {
      console.log("signUpHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return signUp;
}
module.exports = {
  prepareTemplateSendMail,
  signUpFunc: signUpHelper,
};
