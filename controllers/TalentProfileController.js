const express = require("express");

var router = express.Router();
// let { questionUploadFunc } = require("./Routes");

const path = require("path");
const fs = require("fs");
const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let fpathId = "uploads/talentProfile";
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
const talentProfileFile = require("./Routes/TalentProfileModule/TalentProfileManagement");
console.log("talentProfileFile", talentProfileFile);
module.exports = function (conn) {
  // console.log(conn)
  const db = require("../Database/getCollections")(conn.MongoDBConnection);
  const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
  router.post(
    "/setTalentProfileSteps",
    upload.single("talentProfileFile"),
    talentProfileFile.talentProfileUploadHelper(db)
  );
  router.get(
    "/getTalentProfileSteps",
    userAuthMiddleware,
    talentProfileFile.getLatestTalentProfileHelper(db)
  );

  return router;
};
