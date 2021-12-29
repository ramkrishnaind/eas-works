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
function getResults(qnsData) {
  const data = { totalQuestions: qnsData.length, correctAnswers: 0 };
  qnsData.forEach((qnsAns) => {
    let isCorrect = true;
    qnsAns.optionsWithAnswers.forEach((choice) => {
      if (choice.answer !== choice.attempt) {
        isCorrect = false;
        return;
      }
    });
    if (!data.hasOwnProperty("typeAnswers")) {
      data.typeAnswers = { [qnsAns.type]: isCorrect ? 1 : 0 };
    } else {
      const isArrayItemKey = data.typeAnswers.hasOwnProperty(qnsAns.type);
      if (isArrayItemKey) {
        data.typeAnswers[qnsAns.type] += isCorrect ? 1 : 0;
      } else {
        data.typeAnswers[qnsAns.type] = isCorrect ? 1 : 0;
      }
    }
    data.correctAnswers += isCorrect ? 1 : 0;
  });
  return data;
}
function giveTestHelper(Models) {
  async function giveTest(req, res) {
    try {
      let data = _.pick(req.body, ["userId,timeTaken"]);
      data.questionData = req.body.questionData;
      const resultData = getResults(req.body.questionData);

      data.userId = mongoose.Types.ObjectId(req.body.userId);
      // let qnsData = _.pick(req.body, ["questionData"]);
      data.totalQuestions = resultData.totalQuestions;
      data.correctAnswers = resultData.correctAnswers;
      data.typeAnswers = resultData.typeAnswers;

      let test = await new Models.UserTestDB(data).save();

      const result = [];
      await data.questionData.forEach(async (element, index) => {
        element.userTestId = mongoose.Types.ObjectId(test._id);
        console.log("element", element);
        let qns = await new Models.TestAnswerDB(element).save();
        result.push(qns.toObject());
        if (index === data.questionData.length - 1) {
          res.send({
            status: true,
            message: "User test data fetched successfully",
            questionData: result,
          });
        }
      });
    } catch (e) {
      console.log("questionUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Test data save",
      });
    }
  }
  return giveTest;
}
function getUserTestsHelper(Models) {
  async function getUserTests(req, res) {
    try {
      let data = _.pick(req.body, ["userId"]);
      // let getAllTests
      let questionUpload = await Models.UserTestDB.find(
        { userId: mongoose.Types.ObjectId(data.userId) },
        "-_id",
        { sort: { createdAt: -1 } }
      ).exec();
      res.send({
        status: true,
        message: "User Test data fetched successfully",
        userTests: questionUpload,
      });
    } catch (e) {
      console.log("questionUploadHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Test data save",
      });
    }
  }
  return getUserTests;
}

module.exports = {
  uploadQuestionsFile: questionUploadHelper,
  questionHelper,
  getLatestQuestions: getLatestQuestionHelper,
  giveTest: giveTestHelper,
  getUserTests: getUserTestsHelper,
};
