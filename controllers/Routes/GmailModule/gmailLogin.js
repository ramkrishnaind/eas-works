const googleUtil = require("../../../Helper/google-people.api");
const passport = require("passport");

function getGmailUrlHelper() {
  function getGmailUrl(req, res) {
    // console.log("Hi");
    const getResult = async () => {
      res.send(await googleUtil.getAuthUrl());
    };

    getResult();
  }
  return getGmailUrl;
}
function setGmailUserHelper() {
  function setGmailUser(req, res) {
    // console.log("Hi");
    const getResult = async () => {
      res.send(await googleUtil.getUserDetails(req.query.code));
    };
    getResult();
  }
  return setGmailUser;
}
module.exports = {
  getGmailUrl: getGmailUrlHelper,
  setGmailUser: setGmailUserHelper,
};
