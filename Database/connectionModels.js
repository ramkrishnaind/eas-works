module.exports = function (mongoose) {
  mongoose.model("user", require("./schema/user"));
  mongoose.model("authToken", require("./schema/authToken"));
  // mongoose.model("menuModule", require("./schema/menuModule"));
  mongoose.model("userRole", require("./schema/userRole"));
  mongoose.model("disc", require("./schema/disc"));
  mongoose.model("questionUpload", require("./schema/questionFile"));
  mongoose.model("question", require("./schema/questions"));
  mongoose.model("employerProfile", require("./schema/employerProfile"));
  // mongoose.model('reqCallback', require('./schema/reqCallback'));
  // mongoose.model('enquiry', require('./schema/enquiry'));
  // mongoose.model('review', require('./schema/review'));
  // mongoose.model('property', require('./schema/property'));
  // mongoose.model('pFeatures', require('./schema/pFeatures'));
  // mongoose.model('pImage', require('./schema/pImage'));
  // mongoose.model('pPrice', require('./schema/pPrice'));
  // mongoose.model('cms', require('./schema/cms'));
  // mongoose.model('slider', require('./schema/slider'));
  // mongoose.model('buildingMaterials', require('./schema/buildingMaterials'));
  // mongoose.model('supplier', require('./schema/supplier'));
  // mongoose.model('contactus', require('./schema/contactus'));
  // mongoose.model('feedback', require('./schema/feedback'));
  // mongoose.model('siteVisit', require('./schema/siteVisit'));
  // mongoose.model('career', require('./schema/career'));
  // mongoose.model('blog', require('./schema/blog'));
  // mongoose.model('homeAbout', require('./schema/homeAbout'));
  // mongoose.model('homeMovingBanner', require('./schema/homeMovingBanner'));
  // mongoose.model('dealingInItem', require('./schema/dealingInItem'));
  // mongoose.model('dealingIn', require('./schema/dealingIn'));
  // mongoose.model('service', require('./schema/service'));
  // mongoose.model('serviceItem', require('./schema/serviceItem'));
  // mongoose.model('team', require('./schema/team'));
  // mongoose.model('address', require('./schema/address'));
  // mongoose.model('socialMedia', require('./schema/socialMedia'));
  // mongoose.model('jobApplication', require('./schema/jobApplication'));
  // mongoose.model('newsLetterSubscribers', require('./schema/newsLetterSubscribers'));
  // mongoose.model('booking', require('./schema/booking'));
  // mongoose.model('constructionProcess', require('./schema/constructionProcess'));
  // mongoose.model('investWithUs', require('./schema/investWithUs'));
  // mongoose.model('serviceEnquiry', require('./schema/serviceEnquiry'));
  // mongoose.model('aboutPage', require('./schema/aboutPage'));
  // mongoose.model('finance', require('./schema/finance'));
  // mongoose.model('wishList', require('./schema/wishList'));
  // mongoose.model('otp', require('./schema/otp'));
  mongoose.model(
    "talentProfileUpload",
    require("./schema/talentProfileUpload")
  );
  mongoose.model("chatRoomMessage", require("./schema/chatRoomMessage"));
  mongoose.model("chatRoomFile", require("./schema/chatRoomFile"));
  mongoose.model("chatRoom", require("./schema/chatRoom"));
  mongoose.model(
    "employerProfileUploads",
    require("./schema/employerProfileUpload")
  );
  mongoose.model(
    "talentProfileVideoUpload",
    require("./schema/talentProfileVideoUpload")
  );
  mongoose.model(
    "talentProfileResumeUpload",
    require("./schema/talentProfileResumeUpload")
  );
  mongoose.model(
    "talentProfilePhotoUpload",
    require("./schema/talentProfilePhotoUpload")
  );
  mongoose.model(
    "employerProfilePhotoUpload",
    require("./schema/employerProfilePhotoUpload")
  );
  mongoose.model("userTest", require("./schema/userTest"));
  mongoose.model("talentProfile", require("./schema/talentProfile"));
  mongoose.model("testAnswer", require("./schema/testAnswers"));
};
