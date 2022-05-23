const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FileSchema = new Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fileUrl: String,
  createdAt: { type: Date, default: new Date() },
});
let schema = new Schema(
  {
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatRoom",
      default: null,
    },
    messages: [FileSchema],
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
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
    collection: "chatRoomFile",
  }
);

module.exports = schema;
