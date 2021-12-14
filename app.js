const createError = require("http-errors");
const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const cors = require("cors");
const app = express();
require("dotenv").config();
console.log("rooturl", process.env.SERVER_URL);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "*" }));
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(
  session({
    secret: "EasWorks",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/uploads", express.static("uploads"));
app.set("trust proxy", 1);
const MongoDBConnection = require("./Database/connection");
var prefix = "/api/";

//app.use('/api/pricing', require('./controllers/pricing.controller')({ MongoDBConnection }));
console.log();
app.use(
  `${prefix}users`,
  require("./controllers/UsersController")({ MongoDBConnection })
);
// app.use(
//   `${prefix}menuModule`,
//   require("./Controllers/MenuModuleController")({ MongoDBConnection })
// );
app.use(
  `${prefix}role`,
  require("./controllers/RoleController")({ MongoDBConnection })
);
app.use(
  `${prefix}questions`,
  require("./Controllers/QuestionConroller")({ MongoDBConnection })
);

// app.use(
//   `${prefix}callback`,
//   require("./Controllers/CallbackController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}enquiry`,
//   require("./Controllers/EnquiryController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}review`,
//   require("./Controllers/ReviewController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}property`,
//   require("./Controllers/PropertyController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}feedback`,
//   require("./Controllers/ClientFeedbackController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}cms`,
//   require("./Controllers/CMSController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}slider`,
//   require("./Controllers/SliderController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}builder`,
//   require("./Controllers/BuildingMaterialsController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}services`,
//   require("./Controllers/ServicesController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}contactus`,
//   require("./Controllers/ContactUsController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}sitevisit`,
//   require("./Controllers/siteVisitController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}career`,
//   require("./Controllers/CareerController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}blog`,
//   require("./Controllers/BlogController")({ MongoDBConnection })
// );
app.use(
  `${prefix}home`,
  require("./controllers/HomeController")({ MongoDBConnection })
);
// app.use(
//   `${prefix}team`,
//   require("./Controllers/OurTeamController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}booking`,
//   require("./Controllers/BookingController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}constructionProcess`,
//   require("./Controllers/ConstructionProcessController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}investWithUs`,
//   require("./Controllers/InvestWithUsController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}newsLetter`,
//   require("./Controllers/NewsLetterController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}aboutPage`,
//   require("./Controllers/AboutController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}finance`,
//   require("./Controllers/FinanceController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}otp`,
//   require("./Controllers/OtpController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}supplier`,
//   require("./Controllers/SupplierController")({ MongoDBConnection })
// );
// app.use(
//   `${prefix}deleteImage`,
//   require("./Controllers/DeleteImageController")({ MongoDBConnection })
// );

// // Bootstrap models
// var models_path = __dirname + "/models";
// var model_files = fs.readdirSync(models_path);
// model_files.forEach(function (file) {
//   require(models_path + "/" + file);
// });

// // Bootstrap controllers
// var controllers_path = __dirname + "/controllers";
// var controller_files = fs.readdirSync(controllers_path);
// controller_files.forEach(function (file) {
//   require(controllers_path + "/" + file)(app);
// });
app.use(function (req, res, next) {
  next(createError(404));
});
var port = process.env.PORT || "3334";
app.set("port", port);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

module.exports = app;
