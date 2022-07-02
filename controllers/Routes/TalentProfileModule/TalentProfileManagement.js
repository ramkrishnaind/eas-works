const _ = require("lodash");

const Joi = require("joi");
var fs = require("fs");
var path = require("path");
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");
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
function talentProfileVideoUploadHelper(Models) {
  async function uploadTalentProfileFile(req, res) {
    try {
      // console.log("talentProfileData", talentProfileData);
      let talentProfileData = _.pick(req.body, ["userId"]);
      talentProfileData.userId = mongoose.Types.ObjectId(
        talentProfileData.userId
      );
      talentProfileData.file = req.file;
      let talentProfileUpload = await new Models.TalentProfileVideoUploadDB(
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

function talentProfileResumeUploadHelper(Models) {
  async function uploadTalentProfileFile(req, res) {
    try {
      // console.log("talentProfileData", talentProfileData);
      let talentProfileData = _.pick(req.body, ["userId"]);
      talentProfileData.userId = mongoose.Types.ObjectId(
        talentProfileData.userId
      );
      talentProfileData.file = req.file;
      let talentProfileUpload = await new Models.TalentProfileResumeUploadDB(
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
function talentProfilePhotoUploadHelper(Models) {
  async function uploadTalentProfileFile(req, res) {
    try {
      // console.log("talentProfileData", talentProfileData);
      let talentProfileData = _.pick(req.body, ["userId"]);
      talentProfileData.userId = mongoose.Types.ObjectId(
        talentProfileData.userId
      );
      talentProfileData.file = req.file;
      let talentProfileUpload = await new Models.TalentProfilePhotoUploadDB(
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

function talentProfileVideoUploadHelper(Models) {
  async function uploadTalentProfileFile(req, res) {
    try {
      // console.log("talentProfileData", talentProfileData);
      let talentProfileData = _.pick(req.body, ["userId"]);
      talentProfileData.userId = mongoose.Types.ObjectId(
        talentProfileData.userId
      );
      talentProfileData.file = req.file;
      let talentProfileUpload = await new Models.TalentProfileVideoUploadDB(
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
      console.log("talentProfile", JSON.stringify(talentProfile));
      const files = fs.readdirSync(
        path.join(process.cwd(), "public", "images")
      );

      files.forEach(function (file, index) {
        const fileWithoutExtension = file
          .replace(/\.[^/.]+$/, "")
          .toLowerCase();
        const primarySkills = Object.keys(talentProfile);
        console.log("primarySkills", primarySkills);
        primarySkills.forEach((primSkill) => {
          const modules = Object.keys(talentProfile[primSkill].Modules);
          // console.log("modules", modules)
          modules.forEach((module) => {
            const products = talentProfile[primSkill].Modules[module].Product;
            // console.log("products", products)
            if (
              products.some((pr) =>
                pr?.name?.toLowerCase().includes(fileWithoutExtension)
              )
            ) {
              const foundIndex = talentProfile[primSkill].Modules[
                module
              ].Product.findIndex((pr) =>
                pr.name.toLowerCase().includes(fileWithoutExtension)
              );
              talentProfile[primSkill].Modules[module].Product[
                foundIndex
              ].imageUrl = "/images/" + file;
            }
          });
        });
      });

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
      // talentProfile = talentProfile.steps;
      res.send({
        status: true,
        message: "Got the talent profile",
        steps: talentProfile.steps,
        feedbackSteps: talentProfile.feedbackSteps,
        editSteps: talentProfile.editSteps,
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
function getTalentProfileVideoHelper(Models) {
  async function getTalentProfileVideo(req, res) {
    let data = _.pick(req.body, ["userId"]);
    // let getAllTests

    try {
      let talentProfile = await Models.TalentProfileVideoUploadDB.findOne(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { file: 1, userId: 1 },
        { sort: { createdAt: -1 } }
      ).exec();
      talentProfile = talentProfile.toObject();
      //  talentProfile.video = talentProfile.file;
      res.send({
        status: true,
        message: "Got the talent profile video",
        userData: talentProfile,
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
  return getTalentProfileVideo;
}
function getTalentProfileResumeHelper(Models) {
  async function getTalentProfileVideo(req, res) {
    let data = _.pick(req.body, ["userId"]);
    // let getAllTests

    try {
      let talentProfile = await Models.TalentProfileResumeUploadDB.findOne(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { file: 1, userId: 1 },
        { sort: { createdAt: -1 } }
      ).exec();
      talentProfile = talentProfile.toObject();
      //  talentProfile.video = talentProfile.file;
      res.send({
        status: true,
        message: "Got the talent profile resume",
        userData: talentProfile,
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
  return getTalentProfileVideo;
}
function getTalentProfilePhotoHelper(Models) {
  async function getTalentProfileVideo(req, res) {
    let data = _.pick(req.body, ["userId"]);
    // let getAllTests

    try {
      let talentProfile = await Models.TalentProfilePhotoUploadDB.findOne(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { file: 1, userId: 1 },
        { sort: { createdAt: -1 } }
      ).exec();
      talentProfile = talentProfile.toObject();
      //  talentProfile.video = talentProfile.file;
      res.send({
        status: true,
        message: "Got the talent profile photo",
        userData: talentProfile,
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
  return getTalentProfileVideo;
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
function updateTalentProfileFeedbackHelper(Models) {
  async function updateTalentProfile(req, res) {
    let data = _.pick(req.body, ["userId", "feedbackSteps"]);
    // let getAllTests
    console.log(data);
    data.feedbackSteps = JSON.parse(data.feedbackSteps);
    try {
      let talentProfile = await Models.TalentProfileDB.findOneAndUpdate(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { $set: { feedbackSteps: data.feedbackSteps } }
      ).exec();
      // console.log(talentProfile)
      // talentProfile = talentProfile.toObject();
      // talentProfile = talentProfile.feedbackSteps;
      res.send({
        status: true,
        message: "updated the talent profile feedback steps",
        feedbackSteps: talentProfile,
      });
    } catch (e) {
      console.log("getLatestTalentProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in updating talent profile feedback steps",
      });
    }
  }
  return updateTalentProfile;
}
function updateTalentProfileEditStepsHelper(Models) {
  async function updateTalentProfile(req, res) {
    let data = _.pick(req.body, ["userId", "editSteps"]);
    // let getAllTests
    console.log(data);
    data.editSteps = JSON.parse(data.editSteps);
    try {
      let talentProfile = await Models.TalentProfileDB.findOneAndUpdate(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { $set: { editSteps: data.editSteps } }
      ).exec();
      // talentProfile = talentProfile.toObject();
      // talentProfile = talentProfile.editSteps;
      res.send({
        status: true,
        message: "updated the talent profile edit steps",
        editSteps: talentProfile,
      });
    } catch (e) {
      console.log("getLatestTalentProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in setting the talent profile edit steps",
      });
    }
  }
  return updateTalentProfile;
}
module.exports = {
  talentProfileVideoUploadHelper,
  talentProfileResumeUploadHelper,
  talentProfilePhotoUploadHelper,
  talentProfileUploadHelper,
  getLatestTalentProfileHelper,
  getTalentProfileVideoHelper,
  getTalentProfileResumeHelper,
  getTalentProfilePhotoHelper,
  getTalentProfile: getTalentProfileHelper,
  createTalentProfile: createTalentProfileHelper,
  updateTalentProfile: updateTalentProfileHelper,
  updateTalentProfileFeedback: updateTalentProfileFeedbackHelper,
  updateTalentProfileEditSteps: updateTalentProfileEditStepsHelper,
};
