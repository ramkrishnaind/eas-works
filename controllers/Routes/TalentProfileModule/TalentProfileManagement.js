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
function getTalentProfileHelper(Models) {
  async function getLatestTalentProfile(req, res) {
    let data = _.pick(req.body, ["userId"]);
    // let getAllTests

    try {
      let talentProfile = await Models.TalentProfileDB.findOne(
        { userId: mongoose.Types.ObjectId(data.userId) },
        "-_id",
        { sort: { createdAt: -1 } }
      ).exec();
      talentProfile = talentProfile.toObject();
      talentProfile = talentProfile.steps;
      res.send({
        status: true,
        message: "Got the talent profile",
        steps: talentProfile,
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
function createTalentProfileHelper(Models) {
  async function createTalentProfile(req, res) {
    try {
      let talentProfileData = _.pick(req.body, ["userId", "steps"]);
      // console.log("talentProfileData", talentProfileData);
      talentProfileData.steps = JSON.parse(talentProfileData.steps);
      let talentProfile = await new Models.TalentProfileDB(
        talentProfileData
      ).save();
      talentProfile = talentProfile.toObject();

      res.send({
        status: true,
        message: "Created talent profile successfully",
        talentProfile,
      });
    } catch (e) {
      console.log("talentProfileUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in talent profile creation",
      });
    }
  }
  return createTalentProfile;
}
function updateTalentProfileHelper(Models) {
  async function updateTalentProfile(req, res) {
    let data = _.pick(req.body, ["userId", "steps"]);
    // let getAllTests
    console.log(data);
    data.steps = JSON.parse(data.steps);
    try {
      let talentProfile = await Models.TalentProfileDB.findOneAndUpdate(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { $set: { steps: data.steps } }
      ).exec();
      talentProfile = talentProfile.toObject();
      talentProfile = talentProfile.steps;
      res.send({
        status: true,
        message: "updated the talent profile",
        steps: talentProfile,
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
  return updateTalentProfile;
}
module.exports = {
  talentProfileUploadHelper,
  getLatestTalentProfileHelper,
  getTalentProfile: getTalentProfileHelper,
  createTalentProfile: createTalentProfileHelper,
  updateTalentProfile: updateTalentProfileHelper,
};
