const _ = require("lodash");

const Joi = require("joi");
var fs = require('fs');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");
var mongoose = require("mongoose");
const errorResponseHelper = require("../../../Helper/errorResponse");

function employerProfileUploadHelper(Models) {
  async function uploadEmployerProfileFile(req, res) {
    try {
      let employerProfileData = _.pick(req.body, ["steps"]);
      // console.log("employerProfileData", employerProfileData.steps);
      employerProfileData.steps = JSON.parse(employerProfileData.steps);
      employerProfileData.file = req.file;
      let employerProfileUpload = await new Models.EmployerProfileUploadDB(
        employerProfileData
      ).save();
      employerProfileUpload = employerProfileUpload.toObject();

      res.send({
        status: true,
        message: "File Upladed successfully",
        employerProfileUpload,
      });
    } catch (e) {
      console.log("employerProfileUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in employer profile Upload",
      });
    }
  }
  return uploadEmployerProfileFile;
}

function getLatestEmployerProfileHelper(Models) {
  async function getLatestEmployerProfile(req, res) {
    try {
      let employerProfile = await Models.EmployerProfileUploadDB.findOne(
        {},
        "steps -_id",
        { sort: { createdAt: -1 } }
      ).exec();
      employerProfile = employerProfile.toObject();
      employerProfile = employerProfile.steps;


      res.send({
        status: true,
        message: "Got the employer profile options",
        employerProfile,
      });
    } catch (e) {
      console.log("getLatestTalentProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting employer profile",
      });
    }
  }
  return getLatestEmployerProfile;
}

function createEmployerProfileHelper(Models) {
  async function createEmployerProfile(req, res) {
    try {
      let employerProfileData = _.pick(req.body, ["userId", "steps"]);
      // console.log("employerProfileData", employerProfileData);
      employerProfileData.steps = JSON.parse(employerProfileData.steps);
      let employerProfile = await new Models.EmployerProfileDB(
        employerProfileData
      ).save();
      employerProfile = employerProfile.toObject();

      res.send({
        status: true,
        message: "Created employer profile successfully",
        employerProfile,
      });
    } catch (e) {
      console.log("employerProfileUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in employer profile creation",
      });
    }
  }
  return createEmployerProfile;
}
function getEmployerProfileHelper(Models) {
  async function getLatestEmployerProfile(req, res) {
    let data = _.pick(req.body, ["userId"]);
    // let getAllTests

    try {
      let employerProfile = await Models.EmployerProfileDB.findOne(
        { userId: mongoose.Types.ObjectId(data.userId) },
        "-_id",
        { sort: { createdAt: -1 } }
      ).exec();
      employerProfile = employerProfile.toObject();
      // employerProfile = employerProfile.steps;
      res.send({
        status: true,
        message: "Got the employer profile",
        steps: employerProfile.steps,
        editSteps: employerProfile.editSteps,
      });
    } catch (e) {
      console.log("getLatestEmployerProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting employer profile",
      });
    }
  }
  return getLatestEmployerProfile;
}
function updateEmployerProfileHelper(Models) {
  async function updateEmployerProfile(req, res) {
    let data = _.pick(req.body, ["userId", "steps"]);
    // let getAllTests
    console.log(data);
    data.steps = JSON.parse(data.steps);
    try {
      let employerProfile = await Models.EmployerProfileDB.findOneAndUpdate(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { $set: { steps: data.steps } }
      ).exec();
      employerProfile = employerProfile.toObject();
      employerProfile = employerProfile.steps;
      res.send({
        status: true,
        message: "updated the employer profile",
        steps: employerProfile,
      });
    } catch (e) {
      console.log("getLatestEmployerProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting employer profile",
      });
    }
  }
  return updateEmployerProfile;
}
function updateEmployerProfileEditStepsHelper(Models) {
  async function updateEmployerProfile(req, res) {
    let data = _.pick(req.body, ["userId", "editSteps"]);
    // let getAllTests
    console.log(data);
    data.editSteps = JSON.parse(data.editSteps);
    try {
      let employerProfile = await Models.EmployerProfileDB.findOneAndUpdate(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { $set: { editSteps: data.editSteps } }
      ).exec();
      // employerProfile = employerProfile.toObject();
      // employerProfile = employerProfile.editSteps;
      res.send({
        status: true,
        message: "updated the employer profile edit steps",
        editSteps: employerProfile,
      });
    } catch (e) {
      console.log("getLatestEmployerProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in setting the employer profile edit steps",
      });
    }
  }
  return updateEmployerProfile;
}
function employerProfilePhotoUploadHelper(Models) {
  async function uploadEmployerProfileFile(req, res) {
    try {
      // console.log("employerProfileData", employerProfileData);
      let employerProfileData = _.pick(req.body, ["userId"]);
      employerProfileData.userId = mongoose.Types.ObjectId(employerProfileData.userId)
      employerProfileData.file = req.file;
      let employerProfileUpload = await new Models.EmployerProfilePhotoUploadDB(
        employerProfileData
      ).save();
      employerProfileUpload = employerProfileUpload.toObject();

      res.send({
        status: true,
        message: "File Upladed successfully",
        employerProfileUpload,
      });
    } catch (e) {
      console.log("employerProfileUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in employer profile Upload",
      });
    }
  }
  return uploadEmployerProfileFile;
}
function getEmployerProfilePhotoHelper(Models) {
  async function getEmployerProfileVideo(req, res) {
    let data = _.pick(req.body, ["userId"]);
    // let getAllTests

    try {
      let employerProfile = await Models.EmployerProfilePhotoUploadDB.findOne(
        { userId: mongoose.Types.ObjectId(data.userId) },
        { 'file': 1, "userId": 1 },
        { sort: { createdAt: -1 } }
      ).exec();
      employerProfile = employerProfile.toObject();
      //  employerProfile.video = employerProfile.file;
      res.send({
        status: true,
        message: "Got the employer profile photo",
        userData: employerProfile,
      });
    } catch (e) {
      console.log("getLatestEmployerProfileHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting employer profile",
      });
    }
  }
  return getEmployerProfileVideo;
}
module.exports = {

  employerProfileUploadHelper,
  getLatestEmployerProfileHelper,
  createEmployerProfileHelper,
  getEmployerProfileHelper,
  updateEmployerProfileHelper,
  updateEmployerProfileEditStepsHelper,
  employerProfilePhotoUploadHelper,
  getEmployerProfilePhotoHelper
};
