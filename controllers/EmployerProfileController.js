const express = require("express");

var router = express.Router();
// let { questionUploadFunc } = require("./Routes");

const path = require("path");
const fs = require("fs");
const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let fpathId = "uploads/employerProfile";
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
const userAuthMiddlewareFunction = require("../Middleware/userAuth");
const employerProfileFile = require("./Routes/EmployerProfileModule/EmployerProfileManagement");

module.exports = function (conn) {
  // console.log(conn)
  const db = require("../Database/getCollections")(conn.MongoDBConnection);
  const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);

  router.post(
    "/setEmployerProfileSteps",
    userAuthMiddleware,
    upload.single("employerProfileFile"),
    employerProfileFile.employerProfileUploadHelper(db)
  );
  router.get(
    "/getEmployerProfileSteps",
    // userAuthMiddleware,
    employerProfileFile.getLatestEmployerProfileHelper(db)
  );
  router.post(
    "/createEmployerProfile",
    employerProfileFile.createEmployerProfileHelper(db)
  );
  router.post(
    "/getEmployerProfile",
    // userAuthMiddleware,
    employerProfileFile.getEmployerProfileHelper(db)
  );
  router.post(
    "/updateEmployerProfile",
    // userAuthMiddleware,
    employerProfileFile.updateEmployerProfileHelper(db)
  );

  router.post(
    "/updateEmployerProfileEditSteps",
    // userAuthMiddleware,
    employerProfileFile.updateEmployerProfileEditStepsHelper(db)
  );
  router.post(
    "/setEmployerProfilePhoto",
    upload.single("employerProfilePhoto"),
    employerProfileFile.employerProfilePhotoUploadHelper(db)
  );
  router.post(
    "/getEmployerProfilePhoto",
    employerProfileFile.getEmployerProfilePhotoHelper(db)
  );
  return router;
};
