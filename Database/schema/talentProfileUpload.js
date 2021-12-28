const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const schema = new Schema(
  {
    file: {
      type: Object,
      required: true,
    },
    steps: {
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
    collection: "talentProfileUploads",
  }
);

module.exports = schema;
