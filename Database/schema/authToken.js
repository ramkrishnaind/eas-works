//Including Mongoose model...
var mongoose = require("mongoose");
const moment = require("moment");
//creating object
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

//Schema for user
var authTokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    token: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
    superAdminAccess: {
      type: Boolean,
    },
  },
  { collection: "authToken" }
);

module.exports = authTokenSchema;
