const _ = require("lodash");

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prepareTemplateSendMail } = require("./signup");
const errorResponseHelper = require("../../../Helper/errorResponse");

const logInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

function logInHelper(Models) {
  async function logIn(req, res) {
    try {
      // console.log(req.sessionID)
      let payload = req.body;
      // validate data using joi
      let validateData = logInSchema.validate(payload);
      if (validateData.error) {
        throw {
          status: false,
          error: validateData,
          message: "Invalid data",
          validationError: true,
        };
      }

      payload.email = String(payload.email).toLowerCase();
      let userData = await Models.UserDB.findOne({ email: payload.email });
      if (userData) await userData.populate("userRole");
      // if (!userData) {
      //   throw {
      //     status: false,
      //     error: true,
      //     message: "Email/Password is incorrect",
      //     statusCode: 401,
      //     dataIncorrect: true,
      //   };
      // }

      // checking password
      let isValidPassword = await bcrypt.compare(
        payload.password,
        userData.password
      );
      if (!isValidPassword) {
        throw {
          status: false,
          error: true,
          message: "Email/Password is incorrect",
          statusCode: 401,
          dataIncorrect: true,
        };
      }

      if (!userData.verified) {
        // user is not verified then send verification email again
        prepareTemplateSendMail(userData);
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
      if (!userData.active) {
        throw {
          status: false,
          error: true,
          message: "Your account has been disabled. Please contact admin",
          adminDisable: true,
          statusCode: 401,
        };
      }
      // let roleName = await Models.MenuModuleDB.find({
      //   _id: { $in: userData.userRole.rights },
      // });
      let roleName = userData.userRole.name;
      console.log(roleName);
      // create token and add in token collection
      let token = jwt.sign(
        { date: new Date(), email: userData.email },
        "esa_works"
      );
      console.log("userData is", userData);

      let tokenObj = {
        email: userData.email,
        userId: userData._id,
        // accountno: userData.accountno,
        token,
        roleName,
        created_at: new Date(),
      };

      let saveToken = await new Models.AuthTokenDB(tokenObj).save();

      let updateUser = await Models.UserDB.update(
        { _id: userData._id },
        { $set: { lastLoginTime: new Date() } }
      );

      req.session.user = {
        _id: userData._id,
        role: roleName,
        // countryCode: userData.countryCode,
        // phone: userData.phone,
        verified: userData.verified,
        active: userData.active,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        // accountno: userData.accountno,
        // mobile: userData.mobile,
        // image: userData.image ? userData.image : [],
        token,
      };

      res.send({
        status: true,
        message: "Login Successful",
        result: {
          user: req.session.user,
        },
      });
    } catch (e) {
      console.log("login err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Login",
      });
    }
  }
  return logIn;
}
module.exports = logInHelper;
