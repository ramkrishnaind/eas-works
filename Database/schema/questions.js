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
    certRelated: {
      type: String,
      type: false,
    },
    domain: {
      type: String,
    },
    moduleSpecific: {
      type: String,
      trim: true,
    },
    product: {
      type: String,
    },
    productSpecific: {
      type: String,
    },
    questionMode: {
      type: String,
    },
    type: {
      type: String,
    },
    questionType: {
      type: String,
    },
    skillLevel: {
      type: String,
    },
    sourceCode: {
      type: String,
    },
    sourceType: {
      type: String,
    },
    comments: {
      type: String,
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
