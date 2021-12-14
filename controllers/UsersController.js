const express = require("express");

var router = express.Router();

const path = require("path");
const fs = require("fs");
const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let fpathId = "uploads/user";
    try {
      if (!fs.existsSync(fpathId)) {
        fs.mkdirSync(fpathId, { recursive: true }, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
    cb(null, fpathId);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({ storage: storage });

const signupFunction = require("./Routes/Authentication/signup");
const userFunction = require("./Routes/UsersModule/UserManagement");
const userAuthMiddlewareFunction = require("../Middleware/userAuth");

let {
  forgotPasswordFunction,
  loginFunction,
  mobileLoginFunction,
  verificationFunction,
  setNewPasswordFunction,
  getAuthTokenFunction,
  logoutFunction,
  reSetPasswordHelper,
} = require("./Routes");

module.exports = function (conn) {
  // console.log(conn)
  const db = require("../Database/getCollections")(conn.MongoDBConnection);
  const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
  // db.UserDB({name: "12", email: "sad"}).save().then(x => console.log(x))
  // db.UserDB.find().then(x => console.log(x))
  router.post("/signup", signupFunction.signUpFunc(db));
  router.post("/login", loginFunction(db));
  router.post("/mobileLogin", mobileLoginFunction(db));
  router.post("/forgotPassword", forgotPasswordFunction(db));
  router.post("/verification", verificationFunction(db));
  router.post("/setNewPassword", setNewPasswordFunction(db));
  router.get("/getAuthToken", getAuthTokenFunction(db));
  router.get("/logout", logoutFunction(db));

  router.post(
    "/createUser",
    userAuthMiddleware,
    upload.array("image"),
    userFunction.createUserFunc(db)
  );
  router.post(
    "/updateUser",
    userAuthMiddleware,
    upload.array("image"),
    userFunction.updateUserFunc(db)
  );
  router.post("/getUser", userAuthMiddleware, userFunction.getUserFunc(db));
  router.post(
    "/getAllUser",
    userAuthMiddleware,
    userFunction.getAllUserFunc(db)
  );
  router.post(
    "/deleteUser",
    userAuthMiddleware,
    userFunction.deleteUserFunc(db)
  );
  router.post(
    "/updateUserStatus",
    userAuthMiddleware,
    userFunction.updateUserStatusFun(db)
  );
  router.post(
    "/getUserProperties",
    userAuthMiddleware,
    userFunction.getUserProperties(db)
  );
  router.post(
    "/getUserWishList",
    userAuthMiddleware,
    userFunction.getUserWishList(db)
  );
  router.post(
    "/getUserBookings",
    userAuthMiddleware,
    userFunction.getUserBookings(db)
  );
  router.post(
    "/addToWishList",
    userAuthMiddleware,
    userFunction.addToWishList(db)
  );
  router.post(
    "/removeFromWishList",
    userAuthMiddleware,
    userFunction.removeFromWishList(db)
  );
  router.post("/reSetPassword", userAuthMiddleware, reSetPasswordHelper(db));

  return router;
};
