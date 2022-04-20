// helper/userHelper.js
const mongoose = require('mongoose')
const MongoDBConnection = require("../Database/connection");
const allCollection = require('../Database/getCollections')(MongoDBConnection);
const users = [];

// Join user to chat
async function newUser(id, username, room) {
    // const user = { id, username, room };
    const chatUser = await new allCollection.ChatUserDB({ socketId: id, username, room }).save()

    // users.push(user);

    return chatUser;
}

// Get current user
async function getActiveUser(id) {
    console.log("socketid", id)
    return await allCollection.ChatUserDB.findOne({ socketId: id }).exec()
    // users.find(user => user.id === id);
}

// User leaves chat
async function exitRoom(id) {
    // const index = users.findIndex(user => user.id === id);

    // if (index !== -1) {
    //     return users.splice(index, 1)[0];
    // }
    await allCollection.ChatUserDB.findOneAndDelete({ socketId: id })
}

// Get room users
async function getIndividualRoomUsers(room) {
    // return users.filter(user => user.room === room);
    console.log("room", room)
    return await allCollection.ChatUserDB.find({ room }).exec()
}

module.exports = {
    newUser,
    getActiveUser,
    exitRoom,
    getIndividualRoomUsers
};
