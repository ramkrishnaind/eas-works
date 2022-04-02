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
const passport = require("passport");
app.use(express.urlencoded({ extended: false }));
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
// const { CityLite } = require('country-state-city-js')
//Middleware
app.use(express.json({ limit: '50mb' }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

//Get the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Developer Console
const GOOGLE_CLIENT_ID =
  "243499270913-1q6i3qjn2q7n9a7fb0383alg2fetd7it.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GITHUB_CLIENT_ID = "7ee1b0a43b73c473e120";
const GITHUB_CLIENT_SECRET = "3d8beec6b6a6cb3bbf48a19969dd5b076ecc1535";

const LINKEDIN_CLIENT_ID = "77xgttza91klbj";
const LINKEDIN_CLIENT_SECRET = "vpUD0fNqWFVYV77U";
// const cities = CityLite("IN", "MH")
// console.log("cities", cities)
authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
};
GitHubStrategy.prototype.authorizationParams = function (options) {
  return options || {};
};
//Use "GoogleStrategy" as the Authentication Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://eas-works.herokuapp.com/api/gmail/callback",
      passReqToCallback: true,
    },
    authUser
  )
);
passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_CLIENT_ID,
      clientSecret: LINKEDIN_CLIENT_SECRET,
      callbackURL: "https://eas-works.herokuapp.com/api/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);
// passport.use(
//   new LinkedInStrategy(
//     {
//       consumerKey: LINKEDIN_CLIENT_ID,
//       consumerSecret: LINKEDIN_CLIENT_SECRET,
//       callbackURL: "https://eas-works.herokuapp.com/api/linkedin/callback",
//     },
//     function (token, tokenSecret, profile, done) {
//       process.nextTick(function () {
//         // To keep the example simple, the user's LinkedIn profile is returned to
//         // represent the logged-in user.  In a typical application, you would want
//         // to associate the LinkedIn account with a user record in your database,
//         // and return that user instead.
//         return done(null, profile);
//       });
//     }
//   )
// );
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "https://eas-works.herokuapp.com/api/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        done(null, profile);
        // User.findOne({ id: profile.id }, function (err, res) {
        //   if (err) return done(err);
        //   if (res) {
        //     console.log("user exists");
        //     return done(null, res);
        //   } else {
        //     console.log("insert user");
        //     var user = new User({
        //       id: profile.id,
        //       access_token: accessToken,
        //       refresh_token: refreshToken,
        //     });
        //     user.save(function (err) {
        //       if (err) return done(err);
        //       return done(null, user);
        //     });
        //   }
        // });
      });
    }
  )
);
// const GitHubStrategy = require("passport-github").Strategy;

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       authorizationURL: "https://ENTERPRISE_INSTANCE_URL/login/oauth/authorize",
//       tokenURL: "https://ENTERPRISE_INSTANCE_URL/login/oauth/access_token",
//       userProfileURL: "https://ENTERPRISE_INSTANCE_URL/api/v3/user",
//       callbackURL: "https://eas-works.herokuapp.com/api/github/callback",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       User.findOrCreate({ githubId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );
app.post("/api/github/getGithubUrl", (req, res, next) => {
  if (!req.body.login) {
    return res.sendStatus(400);
  }
  passport.authenticate("github", {
    login: req.body.login,
  })(req, res, next);
});
// app.get("/api/linkedin/getLinkedinUrl", passport.authenticate("linkedin"));
app.get(
  "/api/linkedin/getLinkedinUrl",
  passport.authenticate("linkedin"),
  function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  }
);
app.get(
  "/api/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect(
      "/?name=" + req.user.displayName + "&email=" + req.user.emails[0].value
    );
  }
);
app.get(
  "/api/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
    scope: ["user"],
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("req.user", req.user);
    res.redirect(
      "/?name=" + req.user.displayName + "&email=" + req.user.emails[0].value
    );
  }
);
app.get(
  "/api/gmail/getGmailUrl",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
//Use the req.isAuthenticated() function to check if user is Authenticated
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
app.get(
  "/api/gmail/callback",
  passport.authenticate("google", {
    successRedirect: "/api/gmail/getGmailUser",
    failureRedirect: "/",
  })
);

passport.serializeUser((user, done) => {
  console.log(`\n--------> Serialize User:`);
  console.log(user);
  // The USER object is the "authenticated user" from the done() in authUser function.
  // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("\n--------- Deserialized User:");
  console.log(user);
  // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

  done(null, user);
});
//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
app.get("/api/gmail/getGmailUser", checkAuthenticated, (req, res) => {
  console.log("req.user", req.user);
  res.redirect("/?name=" + req.user.displayName + "&email=" + req.user.email);
});
// app.get(
//   "/api/gmail/getGmailUrl",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );
console.log("rooturl", process.env.SERVER_URL);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

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
app.use(`${prefix}gmail`, require("./controllers/GmailController")());
app.use(
  `${prefix}questions`,
  require("./controllers/QuestionController")({ MongoDBConnection })
);
app.use(
  `${prefix}talentProfile`,
  require("./controllers/TalentProfileController")({ MongoDBConnection })
);
app.use(
  `${prefix}employerProfile`,
  require("./controllers/EmployerProfileController")({ MongoDBConnection })
);
app.use(
  `${prefix}location`,
  require("./controllers/CountryStateCityController")({ MongoDBConnection })
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
