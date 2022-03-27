const express = require("express");

var router = express.Router();
// let { questionUploadFunc } = require("./Routes");

const path = require("path");
const fs = require("fs");
const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let fpathId = "uploads/questions";
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
const uploadQuestionsFile = require("./Routes/QuestionsModule/QuestionsManagement");
console.log("questionUploadFunc", uploadQuestionsFile);
const userAuthMiddlewareFunction = require("../Middleware/userAuth");
module.exports = function (conn) {
  // console.log(conn)
  const db = require("../Database/getCollections")(conn.MongoDBConnection);
  // const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
  const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);

  router.post(
    "/upload",
    upload.single("questionFile"),
    uploadQuestionsFile.uploadQuestionsFile(db)
  );
  router.post(
    "/giveTest",
    userAuthMiddleware,
    uploadQuestionsFile.giveTest(db)
  );
  router.post("/setQuestions", uploadQuestionsFile.questionHelper(db));
  router.post("/getUserTests", uploadQuestionsFile.getUserTests(db));
  router.get(
    "/getLatestQuestions",
    // userAuthMiddleware,
    uploadQuestionsFile.getLatestQuestions(db)
  );

  return router;
};
