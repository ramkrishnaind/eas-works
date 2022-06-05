// helper/userHelper.js

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const MongoDBConnection = require("../Database/connection");
const allCollection = require("../Database/getCollections")(MongoDBConnection);
const users = [];

// Join user to chat
async function getUser(condition) {
  return await allCollection.UserDB.findOne(condition);
}
async function findUsers(condition) {
  const returnUsers = [];
  const { role, active } = condition;
  const roleObj = await allCollection.UserRoleDB.findOne({ name: role });
  const users = await allCollection.UserDB.find({
    userRole: new ObjectId(roleObj._id),
    active,
  });

  users.forEach(async (user) => {
    let talentProfile = await allCollection.TalentProfilePhotoUploadDB.findOne({
      userId: mongoose.Types.ObjectId(user._id),
    });
    // talentProfile = JSON.parse(talentProfile);
    if (talentProfile) console.log("talentProfile", talentProfile);
    let retObj;
    switch (role) {
      case "admin":
      case "freelancer":
        retObj = await allCollection.TalentProfileDB.findById(user._id);
        break;
      case "employer":
        retObj = await allCollection.EmployerProfileDB.findById(user._id);
        break;
    }
    console.log("retObj", retObj);
    returnUsers.push({
      steps: retObj?.steps || [],
      editSteps: retObj?.editSteps || [],
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role,
      lastLoginTime: user.lastLoginTime,
      file: talentProfile?.file || null,
      _id: user._id,
    });
  });
  return returnUsers;
}

module.exports = {
  getUser,
  findUsers,
};
