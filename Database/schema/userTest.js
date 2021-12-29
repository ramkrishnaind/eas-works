const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    timeTaken: {
      type: Number,
      default: 162000,
    },
    totalQuestions: {
      type: Number,
    },
    correctAnswers: {
      type: Number,
    },
    typeAnswers: {
      type: Object,
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
    collection: "userTests",
  }
);

module.exports = schema;
