const _ = require("lodash");
const Joi = require("joi");
var mongoose = require("mongoose");
const errorResponseHelper = require("../../../Helper/errorResponse");

function questionUploadHelper(Models) {
  async function uploadQuestionsFile(req, res) {
    try {
      let qnsData = _.pick(req.body, [
        "tags",
        "certRelated",
        "domain",
        "moduleSpecific",
        "noOfQuestions",
        "product",
        "productSpecific",
        "questionMode",
        "questionType",
        "skillLevel",
        "sourceCode",
        "sourceType",
        "comments",
      ]);
      qnsData.file = req.file;
      let qnsUpload = await new Models.QuestionUploadDB(qnsData).save();
      qnsUpload = qnsUpload.toObject();

      res.send({
        status: true,
        message: "File Upladed successfully",
        qnsUpload,
      });
    } catch (e) {
      console.log("questionUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Questions Upload",
      });
    }
  }
  return uploadQuestionsFile;
}
function getLatestQuestionHelper(Models) {
  async function getLatestQuestionsSet(req, res) {
    try {
      let questionUpload = await Models.QuestionUploadDB.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      ).exec();
      questionUpload = questionUpload.toObject();
      let questions = await Models.QuestionDB.find(
        { fileUploadId: questionUpload._id },
        {},
        {}
      ).exec();
      res.send({
        status: true,
        message: "Got the questions",
        questions,
      });
    } catch (e) {
      console.log("getLatestQuestionHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting questions",
      });
    }
  }
  return getLatestQuestionsSet;
}

function questionHelper(Models) {
  async function questions(req, res) {
    try {
      let qnsData = _.pick(req.body, ["questions"]);
      const result = [];
      await qnsData.questions.forEach(async (element, index) => {
        element.fileUploadId = mongoose.Types.ObjectId(element.fileUploadId);
        console.log("element", element);
        let qns = await new Models.QuestionDB(element).save();
        result.push(qns.toObject());
        if (index === qnsData.questions.length - 1) {
          res.send({
            status: true,
            message: "Questions updated successfully",
            questions: result,
          });
        }
      });
    } catch (e) {
      console.log("questionUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Questions Upload",
      });
    }
  }
  return questions;
}

module.exports = {
  uploadQuestionsFile: questionUploadHelper,
  questionHelper,
  getLatestQuestions: getLatestQuestionHelper,
};
