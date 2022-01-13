var express = require("express");
var router = express.Router();
var googleUtil = require("../Helper/google-util");
/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("code", req.query.code);
  // try {
  //   console.log(googleUtil.getGoogleAccountFromCode(req.query.code));
  // } catch {}

  res.render("index", { title: "Express" });
});

module.exports = router;
