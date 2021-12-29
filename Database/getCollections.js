module.exports = function (mongoose) {
  const UserDB = mongoose.model("user");
  const AuthTokenDB = mongoose.model("authToken");
  // const QuestionUploadDB = mongoose.model("questionUpload");

  const UserRoleDB = mongoose.model("userRole");
  const QuestionUploadDB = mongoose.model("questionUpload");
  const QuestionDB = mongoose.model("question");
  const UserTestDB = mongoose.model("userTest");
  const TestAnswerDB = mongoose.model("testAnswer");
  const TalentProfileUploadDB = mongoose.model("talentProfileUpload");
  // const ReqCallbackDB = mongoose.model('reqCallback');
  // const EnquiryDB = mongoose.model('enquiry');
  // const ReviewDB = mongoose.model('review');
  // const PropertyDB = mongoose.model('property');
  // const FeedbackDB = mongoose.model('feedback');
  // const PFeaturesDB = mongoose.model('pFeatures');
  // const PPriceDB = mongoose.model('pPrice');
  // const PImageDB = mongoose.model('pImage');
  // const CMSDB = mongoose.model('cms');
  // const SliderDB = mongoose.model('slider');
  // const BuildingDB = mongoose.model('buildingMaterials');
  // const ContactUsDB = mongoose.model('contactus');
  // const SiteVisitDB = mongoose.model('siteVisit');
  // const CareerDB = mongoose.model('career');
  // const BlogDB = mongoose.model('blog');
  // const HomeAboutDB = mongoose.model('homeAbout');
  // const HomeMovingBannerDB = mongoose.model('homeMovingBanner');
  // const DealingInDB = mongoose.model('dealingIn');
  // const DealingInItemDB = mongoose.model('dealingInItem');
  // const ServiceDB = mongoose.model('service');
  // const ServiceItemDB = mongoose.model('serviceItem');
  // const TeamDB = mongoose.model('team');
  // const AddressDB = mongoose.model('address');
  // const SocialMediaDB = mongoose.model('socialMedia');
  // const JobApplicationDB = mongoose.model('jobApplication');
  // const NewsLetterSubscribersDB = mongoose.model('newsLetterSubscribers');
  // const BookingDB = mongoose.model('booking');
  // const ConstructionProcessDB = mongoose.model('constructionProcess');
  // const InvestWithUsDB = mongoose.model('investWithUs');
  // const ServiceEnquiryDB = mongoose.model('serviceEnquiry');
  // const AboutPageDB = mongoose.model('aboutPage');
  // const FinanceDB = mongoose.model('finance');
  // const WishListDB = mongoose.model('wishList');
  // const OtpDB = mongoose.model('otp');
  // const SupplierDB = mongoose.model('supplier');
  return {
    UserDB,
    AuthTokenDB,
    // MenuModuleDB,
    UserRoleDB,
    QuestionUploadDB,
    QuestionDB,
    TalentProfileUploadDB,
    UserTestDB,
    TestAnswerDB,
    // ReqCallbackDB,
    // EnquiryDB,
    // ReviewDB,
    // PropertyDB,
    // FeedbackDB,
    // PFeaturesDB,
    // PPriceDB,
    // PImageDB,
    // CMSDB,
    // SliderDB,
    // BuildingDB,
    // ContactUsDB,
    // SiteVisitDB,
    // CareerDB,
    // BlogDB,
    // HomeAboutDB,
    // HomeMovingBannerDB,
    // DealingInDB,
    // DealingInItemDB,
    // ServiceDB,
    // ServiceItemDB,
    // TeamDB,
    // AddressDB,
    // SocialMediaDB,
    // JobApplicationDB,
    // NewsLetterSubscribersDB,
    // BookingDB,
    // ConstructionProcessDB,
    // InvestWithUsDB,
    // ServiceEnquiryDB,
    // AboutPageDB,
    // FinanceDB,
    // WishListDB,
    // OtpDB,
    // SupplierDB
  };
};
