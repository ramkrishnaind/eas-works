const express = require("express");
const MongoDBConnection = require("./Database/connection");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
const socketio = require("socket.io", {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { getUser, findUsers } = require("./helpers/userHelper");
const {
  getChatRooms,
  createChatRooms,
  createChatRoomMessages,
  getChatRoomMessages,
  createChatRoomFileMessages,
  getChatRoomFiles,
} = require("./helpers/chatRoomsHelper");

// const server = http.createServer(app);
require("dotenv").config();
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
const passport = require("passport");
app.use(express.urlencoded({ extended: false }));
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
// const { CityLite } = require('country-state-city-js')
//Middleware
app.use(express.json({ limit: "50mb" }));
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
const GITHUB_CLIENT_ID = "7987dcae3dde97f43cb7";
const GITHUB_CLIENT_SECRET = "686d21e5585c2d50766edecffdaa516276a5f3e8";

// const LINKEDIN_CLIENT_ID = "77xgttza91klbj";
const LINKEDIN_CLIENT_ID = "7715jp367v81gb";
// const LINKEDIN_CLIENT_SECRET = "vpUD0fNqWFVYV77U";
const LINKEDIN_CLIENT_SECRET = "vEwsEf4x0zmNO2Ax";
const checkUserExist = async (email) => {
  const db = require("./Database/getCollections")(MongoDBConnection);
  console.log("db", db);
  return !!(await db.UserDB.findOne({
    email,
  }));
};
// checkUserExist("ramkrishnaindalkar1@gmail.com").then((exist) => {
//   console.log("exist", exist);
// });

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
      callbackURL: process.env.SERVER_URL + "/api/gmail/callback",
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
      callbackURL: process.env.SERVER_URL + "/api/linkedin/callback",
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

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/api/github/callback",
    },

    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

const querystring = require("querystring");
app.post("/api/github/getGithubUrl", (req, res, next) => {
  // if (!req.body.login && !req.body.role) {
  //   return res.sendStatus(400);
  // }
  // passport.authenticate('github', { scope: ['user:email'] })
  passport.authenticate("github", {
    login: req.body.login,
    state: req.body.role,
  })(req, res, next);
});

app.get(
  "/api/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async function (req, res) {
    let slug;
    console.log("user-1", req);
    // const role = req.query.state;

    // switch (role.toLowerCase()) {
    //   case "talent":
    //     slug = process.env.OAUTH_TALENT_SLUG;
    //     break;
    //   case "employer":
    //     slug = process.env.OAUTH_EMPLOYER_SLUG;
    //     break;
    // }
    const { displayName, username, emails, email } = req.user;
    const exist = await checkUserExist(
      email || (emails && emails.length > 0 && emails[0])
    );
    if (exist) {
      slug = process.env.SIGN_IN_SLUG;
    } else {
      slug = process.env.SIGN_UP_SLUG;
    }
    console.log("user", JSON.stringify(req.user));

    const query = new URLSearchParams({
      user: JSON.stringify({
        displayName,
        username,
        email: email || (emails && emails.length > 0 && emails[0]),
      }),
    }).toString();
    res.redirect(process.env.CLIENT_URL + slug + "/?" + query);
  }
);
app.get("/api/logout", (req, res, next) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});
app.post("/api/linkedin/getLinkedinUrl", (req, res, next) => {
  // if (!req.body.role) {
  //   return res.sendStatus(400);
  // }
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
    state: req.body.role,
  })(req, res, next);
});
const midd = (req, res, next) => {
  console.log("req-intercepted", req);
  // if (!req.body.role) {
  //   return res.sendStatus(400);
  // }
  passport.authenticate("linkedin", { failureRedirect: "/linkedin/error" })(
    req,
    res,
    next
  );
  next();
};
app.get(
  "/api/linkedin/callback",
  midd,
  // passport.authenticate("linkedin", { failureRedirect: "/linkedin/error" }),
  async function (req, res) {
    // console.log("req.user", req.user);
    let slug;
    // const role = req.query.state;

    // switch (role.toLowerCase()) {
    //   case "talent":
    //     slug = process.env.OAUTH_TALENT_SLUG;
    //     break;
    //   case "employer":
    //     slug = process.env.OAUTH_EMPLOYER_SLUG;
    //     break;
    // }
    const exist = await checkUserExist(req.user.emails[0].value);
    if (exist) {
      slug = process.env.SIGN_IN_SLUG;
    } else {
      slug = process.env.SIGN_UP_SLUG;
    }
    // console.log("user", JSON.stringify(req.user));

    const { given_name, family_name, email } = req.user;
    const query = new URLSearchParams({
      user: JSON.stringify({ given_name, family_name, email }),
    }).toString();
    res.redirect(process.env.CLIENT_URL + slug + "/?" + query);
  }
);
app.post("/api/gmail/getGmailUrl", (req, res, next) => {
  console.log(req.body);
  // if (!req.body.role) {
  //   return res.sendStatus(400);
  // }
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: req.body.role,
  })(req, res, next);
});
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
app.get(
  "/api/gmail/callback",
  passport.authenticate("google", {
    // successRedirect: `/api/gmail/getGmailUser`,
    failureRedirect: "/",
  }),

  async function (req, res) {
    let slug;
    // const role = req.query.state;

    // switch (role.toLowerCase()) {
    //   case "talent":
    //     slug = process.env.OAUTH_TALENT_SLUG;
    //     break;
    //   case "employer":
    //     slug = process.env.OAUTH_EMPLOYER_SLUG;
    //     break;
    // }
    const exist = await checkUserExist(req.user.emails[0].value);
    if (exist) {
      slug = process.env.SIGN_IN_SLUG;
    } else {
      slug = process.env.SIGN_UP_SLUG;
    }
    // console.log("user", JSON.stringify(req.user));
    const { given_name, family_name, email } = req.user;
    const query = new URLSearchParams({
      user: JSON.stringify({ given_name, family_name, email }),
    }).toString();
    res.redirect(process.env.CLIENT_URL + slug + "/?" + query);
  }
);

passport.serializeUser((user, done) => {
  console.log(`\n--------> Serialize User:`);
  console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("\n--------- Deserialized User:");
  console.log(user);
  done(null, user);
});
// app.get("/api/gmail/getGmailUser", checkAuthenticated, (req, res) => {
//   console.log("req.query", req.query);
//   let slug;
//   const role = req.query.state;
//   switch (role.toLowerCase()) {
//     case "talent":
//       slug = process.env.OAUTH_TALENT_SLUG;
//       break;
//     case "employer":
//       slug = process.env.OAUTH_EMPLOYER_SLUG;
//       break;
//   }
//   res.redirect(
//     process.env.CLIENT_URL +
//       slug +
//       "/?name=" +
//       req.user.displayName +
//       "&email=" +
//       req.user.email
//   );
// });
console.log("rooturl", process.env.SERVER_URL);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

const {
  networkconnectivity,
} = require("googleapis/build/src/apis/networkconnectivity");
const { json } = require("express");
var prefix = "/api/";

//app.use('/api/pricing', require('./controllers/pricing.controller')({ MongoDBConnection }));
console.log();
app.use(
  `${prefix}users`,
  require("./controllers/UsersController")({ MongoDBConnection })
);
app.use(
  `${prefix}disc`,
  require("./controllers/DiscController")({ MongoDBConnection })
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
const io = socketio(server, {
  allowEIO3: true, // false by default
});
// this block will run when the client connects
io.on("connection", (socket) => {
  console.log("connected socket new!");
  socket.on("getUsers", async ({ userRole, _id }) => {
    try {
      console.log("userRole", userRole);
      console.log("_id", _id);
      let users;
      const user = await getUser({ _id });
      switch (userRole) {
        case "freelancer":

        case "employer":
          users = await findUsers({ role: "admin", active: 1 });
          socket.emit("getUsersResponse", {
            data: [{ key: "admin", users }],
            from: user,
          });
          break;
        case "admin":
        default:
          const freelancers = await findUsers({
            role: "freelancer",
            active: 1,
          });
          const employers = await findUsers({ role: "employer", active: 1 });
          socket.emit("getUsersResponse", {
            data: [
              { key: "freelancer", freelancers },
              { key: "employer", employers },
            ],
            from: user,
          });
          break;
      }
    } catch (e) {
      socket.emit("getUsersResponse", {
        error: e,
      });
    }
  });
  socket.on("createRoom", async ({ fromUserId, toUserId, isNew }) => {
    try {
      let create = false;
      let chatRoom;
      if (!isNew) {
        const chatRooms = await getChatRooms([fromUserId, toUserId]);
        console.log("chatRooms", chatRooms);
        if (chatRooms) {
          create = false;
          chatRoom = chatRooms;
        } else {
          create = true;
        }
      } else {
        create = true;
      }
      if (create) chatRoom = await createChatRooms([fromUserId, toUserId]);
      let users;
      socket.emit("createRoomResponse", {
        room: chatRoom,
      });
    } catch (e) {
      socket.emit("createRoomResponse", {
        error: e,
      });
    }
  });
  socket.on("sendTextMessage", async ({ chatRoomId, userId, message }) => {
    try {
      console.log("input", { chatRoomId, userId, message });
      await createChatRoomMessages(chatRoomId, userId, message);
      // const chatRoomMessages = await getChatRoomMessages(chatRoomId);
      // console.log("chatRoomMessagesRes", chatRoomMessages?.messages);
      // const chatRoomFiles = await getChatRoomFiles(chatRoomId);
      // console.log("chatRoomFiles", chatRoomFiles);
      // let allMessages = [
      //   ...Array.from(chatRoomMessages?.messages || []),
      //   ...(chatRoomFiles?.messages || []),
      // ];
      // console.log("allMessages", allMessages);
      // function compare(a, b) {
      //   if (a.createdAt < b.createdAt) {
      //     return -1;
      //   }
      //   if (a.createdAt > b.createdAt) {
      //     return 1;
      //   }
      //   return 0;
      // }
      // allMessages.sort(compare);
      // // console.log("allMessages", allMessages);
      // // allMessages = allMessages.map(async (m) => {
      // //   const usr = await getUser({ _id: m.userId });
      // //   console.log("usr", usr);
      // //   return await usr;
      // // });
      // const result = [];
      // for (let m of allMessages) {
      //   const keys = Object.keys(m._doc);
      //   const onjToPush = {};
      //   console.log("keys", keys);
      //   keys.forEach((k) => {
      //     if (k !== "userId") onjToPush[k] = m[k];
      //   });
      //   const usr = await getUser(m.userId);
      //   onjToPush.user = usr;
      //   result.push(onjToPush);
      // }
      // allMessages = await allMessages;
      // console.log("allMessages", result);
      socket.emit("sendTextMessageResponse", {
        chatRoomId,
        message: "Message sent successfully",
      });
    } catch (e) {
      socket.emit("sendTextMessageResponse", {
        error: e,
      });
    }
  });
  socket.on("getRoomMessages", async ({ chatRoomId }) => {
    try {
      const chatRoomMessages = await getChatRoomMessages(chatRoomId);
      console.log("chatRoomMessagesRes", chatRoomMessages?.messages);
      const chatRoomFiles = await getChatRoomFiles(chatRoomId);
      console.log("chatRoomFiles", chatRoomFiles);
      let allMessages = [
        ...Array.from(chatRoomMessages?.messages || []),
        ...(chatRoomFiles?.messages || []),
      ];
      console.log("allMessages", allMessages);
      function compare(a, b) {
        if (a.createdAt < b.createdAt) {
          return -1;
        }
        if (a.createdAt > b.createdAt) {
          return 1;
        }
        return 0;
      }
      allMessages.sort(compare);
      // console.log("allMessages", allMessages);
      // allMessages = allMessages.map(async (m) => {
      //   const usr = await getUser({ _id: m.userId });
      //   console.log("usr", usr);
      //   return await usr;
      // });
      const result = [];
      for (let m of allMessages) {
        console.log("userId", m.userid);
        const keys = Object.keys(m._doc);
        const onjToPush = {};
        console.log("keys", keys);
        keys.forEach((k) => {
          if (k !== "userId") onjToPush[k] = m[k];
        });
        const usr = await getUser(m.userId);
        onjToPush.user = usr;
        result.push(onjToPush);
      }
      // allMessages = await allMessages;
      // console.log("allMessages", result);
      socket.emit("getRoomMessagesResponse", {
        chatRoomId,
        messages: result,
      });
    } catch (e) {
      socket.emit("getRoomMessagesResponse", {
        error: e,
      });
    }
  });
  socket.on(
    "sendFileMessage",
    async ({ chatRoomId, userId, fileName, fileData }) => {
      try {
        await createChatRoomFileMessages(
          chatRoomId,
          userId,
          fileName,
          fileData
        );
        const chatRoomMessages = await getChatRoomMessages(chatRoomId);
        console.log("chatRoomMessagesRes", chatRoomMessages?.messages);
        const chatRoomFiles = await getChatRoomFiles(chatRoomId);
        console.log("chatRoomFiles", chatRoomFiles);
        let allMessages = [
          ...Array.from(chatRoomMessages?.messages || []),
          ...(chatRoomFiles?.messages || []),
        ];
        console.log("allMessages", allMessages);
        function compare(a, b) {
          if (a.createdAt < b.createdAt) {
            return -1;
          }
          if (a.createdAt > b.createdAt) {
            return 1;
          }
          return 0;
        }
        allMessages.sort(compare);
        // console.log("allMessages", allMessages);
        // allMessages = allMessages.map(async (m) => {
        //   const usr = await getUser({ _id: m.userId });
        //   console.log("usr", usr);
        //   return await usr;
        // });
        const result = [];
        for (let m of allMessages) {
          const keys = Object.keys(m._doc);
          const onjToPush = {};
          console.log("keys", keys);
          keys.forEach((k) => {
            if (k !== "userId") onjToPush[k] = m[k];
          });
          const usr = await getUser(m.userId);
          onjToPush.user = usr;
          result.push(onjToPush);
        }
        // allMessages = await allMessages;
        // console.log("allMessages", result);
        socket.emit("getRoomMessagesResponse", {
          chatRoomId,
          messages: result,
        });
      } catch (e) {
        socket.emit("getRoomMessagesResponse", {
          error: e,
        });
      }
    }
  );
  socket.on("getRoomFileMessages", async ({ chatRoomId }) => {
    try {
      const chatRoomFiles = await getChatRoomFiles(chatRoomId);
      let allMessages = [...(chatRoomFiles?.messages || [])];
      function compare(a, b) {
        if (a.createdAt < b.createdAt) {
          return -1;
        }
        if (a.createdAt > b.createdAt) {
          return 1;
        }
        return 0;
      }
      allMessages.sort(compare);
      allMessages = allMessages.map(async (m) => await getUser(m.userId));
      socket.emit("getRoomFileMessagesResponse", {
        chatRoomId,
        messages: allMessages,
      });
    } catch (e) {
      socket.emit("getRoomFileMessagesResponse", {
        error: e,
      });
    }
  });
});
// io.on("connection", function (socket) {
//   console.log("connected socket!");

//   socket.on("greet", function (data) {
//     console.log("data", data);
//     socket.emit("respond", { hello: "Hey, Mr.Client!" });
//   });
//   socket.on("disconnect", function () {
//     console.log("Socket disconnected");
//   });
// });
// io.on("connect_error", (err) => {
//   console.log(`connect_error due to ${err.message}`);
// });
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

module.exports = app;
