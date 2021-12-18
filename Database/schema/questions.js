const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const schema = new Schema(
  {
    fileUploadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questionUploads",
      default: null,
    },
    question: {
      type: String,
    },
    optionsWithAnswers: {
      type: Array,
    },
    single: {
      type: Boolean,
    },
    fileName: {
      type: String,
    },
    tags: {
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
    collection: "questions",
  }
);

module.exports = schema;
