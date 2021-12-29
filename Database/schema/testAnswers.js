const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const schema = new Schema(
  {
    userTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userTest",
      default: null,
    },
    question: {
      type: String,
    },
    optionsWithAnswers: {
      type: Array,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
  },
  {
    collection: "testAnswers",
  }
);

module.exports = schema;
