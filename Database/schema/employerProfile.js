const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    steps: {
      type: Object,
    },
    editSteps: {
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
    collection: "employerProfiles",
  }
);

module.exports = schema;
