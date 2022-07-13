const _ = require("lodash");
const Joi = require("joi");
const path = require("path");
const bcrypt = require("bcryptjs");
const createTokenFunction = require("../../../Helper/createUniqueToken");
const prepareTemplateAndMailHelper = require("../../../Helper/prepareTemplateAndMail");
const errorResponseHelper = require("../../../Helper/errorResponse");
const CONSTANTSMESSAGE = require("../../../Helper/constantsMessage");
const { nanoid } = require("nanoid");

const createUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim(),
  company: Joi.string().trim(),
  email: Joi.string().email().trim().required(),
  // mobile: Joi.number().required(),
  // countryCode: Joi.number(),
  userRole: Joi.string().required(),
});
const createAdminUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim(),
  company: Joi.string().trim(),
  email: Joi.string().email().trim().required(),
  // mobile: Joi.number().required(),
  password: Joi.string().trim(),
  userRole: Joi.string().required(),
});
const updateUserSchema = Joi.object({
  id: Joi.string().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim(),
  // address: Joi.string().trim(),
  // city: Joi.string().trim(),
  // state: Joi.string().trim(),
});
const getUserSchema = Joi.object({
  _id: Joi.string().trim().required(),
});
const getUserPropertySchema = Joi.object({
  userId: Joi.string().trim().required(),
});
const addUserWishListPropertySchema = Joi.object({
  userId: Joi.string().trim().required(),
  propertyId: Joi.string().trim().required(),
});
const removeWishListPropertySchema = Joi.object({
  userId: Joi.string().trim().required(),
  propertyId: Joi.string().trim().required(),
});
const updateUserStatusSchema = Joi.object({
  _id: Joi.string().trim().required(),
  active: Joi.number().required(),
});

async function prepareTemplateSendMail(data) {
  try {
    let filePath = path.join(
      __dirname,
      "/../../../Template/userAuthenticationWithPassword.html"
    );
    let replacements = {
      name: `${_.capitalize(data.firstName)} ${data.lastName}`,
      username: data.email,
      password: data.passwordText,
      authenticationLink: `${process.env.APP_URL}/verification?token=${data.verificationToken}`,
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

function createUserHelper(Models) {
  async function createUser(req, res) {
    try {
      // console.log(req.sessionID)
      // validate data using joi
      let validateData = createUserSchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // pick data from req.body
      // let userData = _.pick(req.body, ['firstName', 'lastName', 'email', 'mobile', 'countryCode', 'userRole']);
      let userData = _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "company",
        "userRole",
      ]);

      // setting email to lowercase

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
      let passwordText = nanoid(8);
      userData.password = bcrypt.hashSync(passwordText, 10);
      // if (req.files.length > 0)
      //     userData.image = req.files;

      let saveUser = await new Models.UserDB(userData).save();
      saveUser = saveUser.toObject();
      saveUser.passwordText = passwordText;
      // now send mail
      prepareTemplateSendMail(saveUser);

      res.send({
        status: true,
        message: "Verification mail has been sent to your registered email",
        mailSent: true,
      });
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return createUser;
}
function createAdminPanelUserHelper(Models) {
  async function createUser(req, res) {
    try {
      // console.log(req.sessionID)
      // validate data using joi
      let validateData = createAdminUserSchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // pick data from req.body
      // let userData = _.pick(req.body, ['firstName', 'lastName', 'email', 'mobile', 'countryCode', 'userRole']);
      let userData = _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "company",
        "userRole",
        "password",
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

        // if not active, ie disabled by admin

        throw {
          status: false,
          error: true,
          message: "Account already exists",
          duplicateAccount: true,
          statusCode: 400,
        };
      }
      userData.email = String(userData.email).trim().toLowerCase();
      const role = await Models.UserRoleDB.findOne({ name: userData.userRole });
      if (role) {
        userData.userRole = role._id;
      } else {
        throw {
          status: false,
          error: true,
          message: "Role doesn't exists",
          statusCode: 400,
        };
      }
      // creating unique token
      let hash = await createTokenFunction(userData.email);
      userData.verificationToken = hash;
      let passwordText = nanoid(8);
      userData.password = bcrypt.hashSync(userData.password, 10);
      // if (req.files.length > 0)
      //     userData.image = req.files;

      let saveUser = await new Models.UserDB(userData).save();
      saveUser = saveUser.toObject();
      // saveUser.passwordText = passwordText;
      // now send mail

      res.send({
        status: true,
        message: "User Created Successfully",
        data: saveUser,
      });
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
        status: 400,
      });
    }
  }
  return createUser;
}
function getAllUserHelper(Models) {
  async function getAllUser(req, res) {
    try {
      // Getting all Users from Database
      let findData = await Models.UserDB.find().sort({ _id: -1 });
      if (findData.length) {
        // if data found check verified or not
        res.send({ status: true, message: "Users List", data: findData });
      } else {
        res.send({ status: true, message: "No Data found for Users" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return getAllUser;
}
function getUserHelper(Models) {
  async function getUser(req, res) {
    try {
      let validateData = getUserSchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // Getting User from Database
      let findData = await Models.UserDB.findOne({ _id: req.body._id });
      console.log("findData is", findData);
      if (findData) {
        // if data found check verified or not
        res.send({ status: true, message: "User Data", data: findData });
      } else {
        res.send({ status: true, message: "User Data not found" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return getUser;
}
function updateUserStatusHelper(Models) {
  async function updateUserStatus(req, res) {
    try {
      let validateData = updateUserStatusSchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      let bodyData = _.pick(req.body, ["active", "_id"]);
      let setData = {
        active: bodyData.active,
      };
      let updateModule = await Models.UserDB.findOneAndUpdate(
        { _id: bodyData._id },
        { $set: setData }
      );
      console.log("updateModule is", updateModule);
      res.send({
        status: true,
        message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS,
      });
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return updateUserStatus;
}
function deleteUserHelper(Models) {
  async function deleteUser(req, res) {
    try {
      let validateData = getUserSchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // Getting User from Database
      let deleteData = await Models.UserDB.remove({ _id: req.body._id });
      console.log("deleteData is", deleteData);
      if (deleteData) {
        // if data found check verified or not
        res.send({ status: true, message: "User Deleted Successfully" });
      } else {
        res.send({ status: true, message: "User not found" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return deleteUser;
}
function getUserProperties(Models) {
  async function userProperties(req, res) {
    try {
      let validateData = getUserPropertySchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // Getting User from Database
      let Data = await Models.PropertyDB.find({ userId: req.body.userId }).sort(
        { _id: -1 }
      );
      console.log("Data is", Data);
      if (Data) {
        // if data found check verified or not
        res.send({ status: true, message: "User Properties List", data: Data });
      } else {
        res.send({ status: true, message: "User Properties not found" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return userProperties;
}
function findUsers(Models) {
  async function findusers(req, res) {
    try {
      // let validateData = getUserPropertySchema.validate(req.body);
      // if (validateData.error) {
      //   throw { status: false, error: validateData, message: "Invalid data" };
      // }

      // Getting User from Database
      let Data = await Models.PropertyDB.find({ ...req.body });

      console.log("Data is", Data);
      if (Data) {
        // if data found check verified or not
        res.send({ status: true, message: "requested Users", data: Data });
      } else {
        res.send({ status: true, message: "User Properties not found" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return findusers;
}
function getUserBookings(Models) {
  async function userBookings(req, res) {
    try {
      let validateData = getUserPropertySchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // Getting User from Database
      let Data = await Models.BookingDB.find({ userId: req.body.userId })
        .sort({ _id: -1 })
        .populate("propertyId");
      let result = [];
      for (let x = 0; x < Data.length; x++) {
        let item = Data[x].toObject();
        let propertyId = item.propertyId._id;
        let imageData = await Models.PImageDB.findOne({ _id: propertyId });
        let mainImage = imageData ? imageData.mainImage : [];
        item.images = mainImage;
        result.push(item);
      }
      console.log("Data is", result);
      if (result) {
        // if data found check verified or not
        res.send({ status: true, message: "User Booking List", data: result });
      } else {
        res.send({ status: true, message: "User Booking not found" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return userBookings;
}
function getUserWishList(Models) {
  async function userWishList(req, res) {
    try {
      let validateData = getUserPropertySchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // Getting User from Database
      let Data = await Models.WishListDB.find({ userId: req.body.userId })
        .sort({ _id: -1 })
        .populate("propertyId");
      console.log("Data is", Data);
      let result = [];
      for (let x = 0; x < Data.length; x++) {
        let item = Data[x].toObject();
        let propertyId = item.propertyId._id;
        let imageData = await Models.PImageDB.findOne({ propertyId });
        let FeaturesData = await Models.PFeaturesDB.findOne({ propertyId });
        let mainImage = imageData ? imageData.mainImage : [];
        let Features = FeaturesData ? FeaturesData : null;
        item.images = mainImage;
        item.Features = Features;
        result.push(item);
      }
      console.log("Data is", result);
      if (result) {
        // if data found check verified or not
        res.send({ status: true, message: "User Wish List", data: result });
      } else {
        res.send({ status: true, message: "User WishList not found" });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return userWishList;
}
function addToWishList(Models) {
  async function add(req, res) {
    try {
      let validateData = addUserWishListPropertySchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      let WishListData = {
        propertyId: req.body.propertyId,
        userId: req.body.userId,
      };
      let Data = await new Models.WishListDB(WishListData).save();
      console.log("Data is", Data);
      if (Data) {
        // if data found check verified or not
        res.send({ status: true, message: "User Wish Created.", data: Data });
      } else {
        res.send({
          status: true,
          message: "Error While Creating User WishList",
        });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return add;
}
function removeFromWishList(Models) {
  async function remove(req, res) {
    try {
      let validateData = removeWishListPropertySchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      let query = {
        $and: [
          { propertyId: req.body.propertyId },
          { userId: req.body.userId },
        ],
      };
      let Data = await Models.WishListDB.remove(query);
      console.log("Data is", Data);
      if (Data) {
        // if data found check verified or not
        res.send({
          status: true,
          message: "Property Removed From User WishList",
          data: Data,
        });
      } else {
        res.send({
          status: true,
          message: "Error While Property Removing From User WishList",
        });
      }
    } catch (e) {
      console.log("createUserHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in SignUp",
      });
    }
  }
  return remove;
}
function updateUserFunc(Models) {
  async function updateUser(req, res) {
    try {
      // console.log(req.sessionID)
      // validate data using joi
      let validateData = updateUserSchema.validate(req.body);
      if (validateData.error) {
        throw { status: false, error: validateData, message: "Invalid data" };
      }

      // pick data from req.body
      let userData = _.pick(req.body, [
        "id",
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
      ]);
      setData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        city: userData.city,
        state: userData.state,
      };
      let updateModule = await Models.UserDB.findOneAndUpdate(
        { _id: userData.id },
        { $set: setData }
      );
      console.log("updateModule is", updateModule);
      res.send({ status: true, message: "User Profile Updated Successfully." });
    } catch (e) {
      console.log("updateUser err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in user Update",
      });
    }
  }
  return updateUser;
}
function checkTokenValid(Models) {
  async function checkTokenvalidity(req, res, next) {
    try {
      let authToken = req.headers.authorization;

      let tokenArr = authToken.split(" ");
      let token = tokenArr[1];

      if (!token) {
        throw {
          status: false,
          error: true,
          auth: false,
          message: "Token is required",
        };
      }
      let userToken = await Models.AuthTokenDB.findOne({ token })
        .populate("userId")
        .lean();
      if (!userToken) {
        throw {
          status: false,
          error: true,
          auth: false,
          message: "Invalid token",
        };
      }

      if (
        userToken.created_at &&
        new Date(userToken.created_at) < new Date(moment.utc().startOf("day"))
      ) {
        // token is old delete it
        let deleteToken = await Models.AuthTokenDB.deleteOne({ token });
        throw {
          status: false,
          error: true,
          auth: false,
          message: "Token exipred",
          exipred: true,
        };
      }

      req.locals = {
        user: userToken,
      };
      console.log("locals", req.locals);
      res.send({ status: true, message: "Token valid" });
    } catch (e) {
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Token error",
      });
    }
  }
  return checkTokenvalidity;
}
module.exports = {
  prepareTemplateSendMail,
  createUserFunc: createUserHelper,
  getAllUserFunc: getAllUserHelper,
  getUserFunc: getUserHelper,
  updateUserStatusFun: updateUserStatusHelper,
  deleteUserFunc: deleteUserHelper,
  getUserProperties,
  getUserBookings,
  getUserWishList,
  addToWishList,
  removeFromWishList,
  updateUserFunc,
  findUsers,
  createAdminPanelUserHelper,
  checkTokenValid,
};
