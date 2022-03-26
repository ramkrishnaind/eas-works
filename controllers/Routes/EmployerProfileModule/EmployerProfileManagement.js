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
        message: "Got the talent profile options",
        employerProfile,
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
  return getLatestEmployerProfile;
}

module.exports = {

  employerProfileUploadHelper,
  getLatestEmployerProfileHelper,

};
