const express = require("express");

var router = express.Router();

const gmailLogin = require("./Routes/GmailModule/gmailLogin");
module.exports = function () {
  // const db = require("../Database/getCollections")(conn.MongoDBConnection);
  // console.log(conn)
  router.get("/getGmailUrl", gmailLogin.getGmailUrl());
  router.get("/getGmailUser", gmailLogin.setGmailUser());
  return router;
};
