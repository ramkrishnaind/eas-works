const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  createdAt: { type: Date, default: new Date() },
});

let schema = new Schema(
  {
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatRoom",
      default: null,
    },
    messages: [MessageSchema],
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
    collection: "chatRoomMessage",
  }
);

module.exports = schema;
