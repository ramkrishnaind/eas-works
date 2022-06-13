const mongoose = require("mongoose");
// var Promise = require("bluebird");
// const fs = Promise.promisifyAll(require("fs"));
const fs = require("fs");
const MongoDBConnection = require("../Database/connection");
const allCollection = require("../Database/getCollections")(MongoDBConnection);
const { getUser } = require("./userHelper");

async function getChatRooms(users) {
  return await allCollection.ChatRoomDB.findOne({
    users: { $all: users.map((u) => mongoose.Types.ObjectId(u)) },
  });
}
async function createChatRooms(users) {
  return await new allCollection.ChatRoomDB({
    users: users.map((u) => mongoose.Types.ObjectId(u)),
  }).save();
}
async function createChatRoomFileMessages(chatRoomId, userId, fileName, data) {
  console.log("chatRoomId, userId, fileName, data", {
    chatRoomId,
    userId,
    fileName,
    data,
  });
  const user = await getUser({ _id: mongoose.Types.ObjectId(userId) });
  const nameOfFile =
    "uploads/chats/" +
    user.firstName +
    "_" +
    user.lastName +
    "_" +
    chatRoomId +
    "_" +
    fileName;

  const file = await fs.promises.writeFile(nameOfFile, data);

  // console.log("File written successfully\n");
  const chatRoom = await getChatRoomFiles(chatRoomId);
  console.log("chatRoom", chatRoom);
  if (!chatRoom)
    return await new allCollection.ChatRoomFileDB({
      chatRoom: mongoose.Types.ObjectId(chatRoomId),
      messages: [
        {
          userId: mongoose.Types.ObjectId(userId),
          fileUrl: nameOfFile,
        },
      ],
    }).save();
  else {
    const objects = chatRoom.messages;
    objects.push({
      userId: mongoose.Types.ObjectId(userId),
      fileUrl: nameOfFile,
    });

    return await allCollection.ChatRoomMessageDB.findOneAndUpdate(
      { chatRoom: mongoose.Types.ObjectId(chatRoomId) },
      { messages: objects }
    );
  }
}
async function createChatRoomMessages(chatRoomId, userId, message) {
  const chatRoom = await getChatRoomMessages(chatRoomId);
  console.log("chatRoomMessageResult", chatRoom);

  if (!chatRoom)
    return await new allCollection.ChatRoomMessageDB({
      chatRoom: mongoose.Types.ObjectId(chatRoomId),
      messages: [{ userId: mongoose.Types.ObjectId(userId), text: message }],
    }).save();
  else {
    const objects = chatRoom?.messages || [];
    objects.push({ userId: mongoose.Types.ObjectId(userId), text: message });
    return await allCollection.ChatRoomMessageDB.findOneAndUpdate(
      { chatRoom: mongoose.Types.ObjectId(chatRoomId) },
      {
        messages: objects,
      }
    );
  }
}
async function getChatRoomMessages(chatRoomId) {
  console.log("chatRoomId", chatRoomId);
  return await allCollection.ChatRoomMessageDB.findOne({
    chatRoom: mongoose.Types.ObjectId(chatRoomId),
  });
}
async function getChatRoomFiles(chatRoomId) {
  return await allCollection.ChatRoomFileDB.findOne({
    chatRoom: mongoose.Types.ObjectId(chatRoomId),
  });
}
module.exports = {
  getChatRooms,
  createChatRooms,
  createChatRoomMessages,
  createChatRoomFileMessages,
  getChatRoomMessages,
  getChatRoomFiles,
};
