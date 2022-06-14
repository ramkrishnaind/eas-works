const express = require("express");

const fs = require("fs");
var router = express.Router();
const path = require("path");
const {
  sendDisc,
  getUserDiscData,
  getDiscText,
} = require("./Routes/DiscModule/DiscManagement");
const userAuthMiddlewareFunction = require("../Middleware/userAuth");

module.exports = function (conn) {
  // console.log(conn)
  const allCollection = require("../Database/getCollections")(
    conn.MongoDBConnection
  );
  //   const requestAuthMiddleware =
  //     userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

  router.post("/sendDisc", sendDisc(allCollection));
  router.post("/getUserDiscData", getUserDiscData(allCollection));
  router.post("/getDiscText", getDiscText(allCollection));

  return router;
};
