// helper/userHelper.js

const mongoose = require('mongoose')
const MongoDBConnection = require("../Database/connection");
const allCollection = require('../Database/getCollections')(MongoDBConnection);
const users = [];

// Join user to chat
async function getUser(condition) {
    return await allCollection.UserDB.findOne(condition)
}
async function findUsers(condition) {
    return await allCollection.UserDB.find(condition)
}

module.exports = {
    getUser,
    findUsers
};
