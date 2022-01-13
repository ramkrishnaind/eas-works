const express = require("express");
const logger = require("morgan");
const path = require("path");
const indexRouter = require("./routes/index");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// var app = require("express")(),
var passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy,
  //   mongoose = require("mongoose"),
  //   github = require("octonode"),
  //   bodyParser = require("body-parser"),
  session = require("express-session");

var config = {
  clientID: "1d4bf91e551b417d5cd3",
  clientSecret: "ae6c6fafede27a8426dfc3bd610af8e39a19724c",
  callbackURL: "http://localhost:3334/api/github/callback",
};

// var db = mongoose.connect("mongodb://localhost:27017/testDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// var userSchema = new mongoose.Schema(
//   {
//     id: { type: String, unique: true },
//     access_token: String,
//     refresh_token: String,
//     name: String,
//   },
//   { collection: "user" }
// );

// var User = mongoose.model("User", userSchema);
app.use(logger("dev"));
GitHubStrategy.prototype.authorizationParams = function (options) {
  return options || {};
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ id: id }, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
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

function userLogged(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

app.use(
  session({
    secret: "EasWorks",
    resave: false,
    saveUninitialized: true,
  })
);
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.json());

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
// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", {
//     successRedirect: "/profile",
//     failureRedirect: "/",
//     scope: ["user"],
//   })
// );
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/", indexRouter);
// app.get("/", function (req, res) {
//   res.send(`
//         <html>
//         <body>
//             <form action="/login" method="post">
//                 <span>Enter your preferred Github login</span>
//                 <input name="login" type="text" value=""/>
//                 <input type="submit" value="Connect"/>
//             </form>
//         </body>
//         </html>
//     `);
// });

app.post("/login", function (req, res, next) {
  console.log(req);
  if (!req.body.login) {
    return res.sendStatus(400);
  }
  passport.authenticate("github", {
    login: req.body.login,
  })(req, res, next);
});

// app.get("/profile", userLogged, function (req, res) {
//   var client = github.client(req.user.access_token);

//   var ghme = client.me();

//   ghme.repos((err, repos) => {
//     if (err) {
//       console.log(err);
//       res.json({
//         status: "error",
//       });
//     } else {
//       console.log(repos);
//       res.json({
//         status: "ok",
//         data: repos,
//       });
//     }
//   });
// });

app.listen(3334);

// console.log("go to http://localhost:8080/login");
