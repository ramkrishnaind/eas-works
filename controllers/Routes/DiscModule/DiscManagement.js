const _ = require("lodash");
const Joi = require("joi");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const errorResponseHelper = require("../../../Helper/errorResponse");
const getTotals = (data) => {
  let ones = 0,
    twos = 0,
    threes = 0,
    fours = 0,
    others = 0;
  data.forEach((element) => {
    switch (+element) {
      case 1:
        ones++;
        break;
      case 2:
        twos++;
        break;
      case 3:
        threes++;
        break;
      case 4:
        fours++;
        break;
      default:
        other++;
        break;
    }
    // counter++;
  });
  return [ones, twos, threes, fours, others];
};
function sendDiscHelper(Models) {
  async function sendDisc(req, res) {
    try {
      let qnsData = _.pick(req.body, ["data", "userId"]);
      qnsData.totals = getTotals(qnsData.data);
      console.log("qnsData.totals ", qnsData.totals);
      let qnsUpload = await new Models.DiscDB(qnsData).save();
      qnsUpload = qnsUpload.toObject();

      res.send({
        status: true,
        message: "Disc data saved successfully",
        qnsUpload,
      });
    } catch (e) {
      console.log("sendDiscHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in Questions Save",
      });
    }
  }
  return sendDisc;
}
function getDiscTextHelper(Models) {
  async function getDiscText(req, res) {
    try {
      let qnsData = _.pick(req.body, ["userId"]);
      let userData = await Models.DiscDB.findOne({
        userId: new ObjectId(qnsData.userId),
      }).exec();
      console.log("userData", userData);
      if (userData) {
        const [keyD, keyI, keyS, keyC] = userData.totals;
        const disc = require("../../../uploads/disc.json");
        const data = disc.find(
          (item) =>
            item.keyD == keyD &&
            item.keyI == keyI &&
            item.keyS == keyS &&
            item.keyC == keyC
        );
        if (data) {
          res.send({
            status: true,
            message: "Data retrieved successfully",
            data: data.text,
          });
          return;
        } else {
          res.send({
            status: false,
            error: new Error("No Match found"),
          });
          return;
        }
      }
      // let qnsData = _.pick(req.body, ["keyD", "keyI", "keyS", "keyC"]);

      res.send({
        status: false,
        error: new Error("No Match found"),
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
  return getDiscText;
}
function getUserDiscDataHelper(Models) {
  async function getUserDiscData(req, res) {
    try {
      let qnsData = _.pick(req.body, ["userId"]);
      let data = await Models.DiscDB.find({
        userId: new ObjectId(qnsData.userId),
      }).exec();
      data = data;
      console.log("data", data);
      data = data.map((d) => {
        const dTemp = {
          _id: d._id,
          userId: d.userId,
          totals: d.totals,
          created: d.created,
          updated: d.updated,
        };
        console.log("dTemp", dTemp);
        return dTemp;
      });
      res.send({
        status: true,
        message: "Got the data",
        data,
      });
    } catch (e) {
      console.log("getUserDiscDataHelper err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting data",
      });
    }
  }
  return getUserDiscData;
}
module.exports = {
  sendDisc: sendDiscHelper,
  getUserDiscData: getUserDiscDataHelper,
  getDiscText: getDiscTextHelper,
};
