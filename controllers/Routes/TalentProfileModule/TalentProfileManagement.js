const _ = require("lodash");
const Joi = require("joi");
var mongoose = require("mongoose");
const errorResponseHelper = require("../../../Helper/errorResponse");

function talentProfileUploadHelper(Models) {
  async function uploadTalentProfileFile(req, res) {
    try {
      let talentProfileData = _.pick(req.body, ["steps"]);
      // console.log("talentProfileData", talentProfileData);
      talentProfileData.steps = JSON.parse(talentProfileData.steps);
      talentProfileData.file = req.file;
      let talentProfileUpload = await new Models.TalentProfileUploadDB(
        talentProfileData
      ).save();
      talentProfileUpload = talentProfileUpload.toObject();

      res.send({
        status: true,
        message: "File Upladed successfully",
        talentProfileUpload,
      });
    } catch (e) {
      console.log("talentProfileUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in talent profile Upload",
      });
    }
  }
  return uploadTalentProfileFile;
}
function getLatestTalentProfileHelper(Models) {
  async function getLatestTalentProfile(req, res) {
    try {
      let talentProfile = await Models.TalentProfileUploadDB.findOne(
        {},
        "steps -_id",
        { sort: { createdAt: -1 } }
      ).exec();
      talentProfile = talentProfile.toObject();
      talentProfile = talentProfile.steps;
      res.send({
        status: true,
        message: "Got the talent profile options",
        talentProfile,
      });
    } catch (e) {
      console.log("getLatestTalentProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting talent profile",
      });
    }
  }
  return getLatestTalentProfile;
}

module.exports = {
  talentProfileUploadHelper,
  getLatestTalentProfileHelper,
};
