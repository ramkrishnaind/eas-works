const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const schema = new Schema(
  {
    file: {
      type: Object,
      required: true,
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
    noOfQuestions: {
      type: Number,
      default: 0,
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
    collection: "questionUploads",
  }
);

module.exports = schema;
