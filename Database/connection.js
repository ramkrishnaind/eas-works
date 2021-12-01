const mongoose = require("mongoose"),
  dbconf = require("../Database/db.json");

let dbString = "mongodb+srv://" + dbconf.dbcredentials.user;
dbString = dbString + ":" + dbconf.dbcredentials.password;
dbString = dbString + "@" + dbconf.dbcredentials.address;
// dbString = dbString + ":" + dbconf.dbcredentials.port;
dbString =
  dbString +
  "/" +
  dbconf.dbcredentials.database +
  "?retryWrites=true&w=majority";
// const uri =
//   "mongodb+srv://ramkrishnaindal:51ByOJaYZl9kpCbK@ramkrishna.yixfe.mongodb.net/test?retryWrites=true&w=majority";
//   "mongodb+srv://ramkrishnaindal:51ByOJaYZl9kpCbK@ramkrishna.yixfe.mongodb.net/esaworks_db"
if (process.env.NODE_ENV == "localDevelopment") {
  dbString = process.env.LOCALDATABASE;
}
console.log("dbString is", dbString);
var conn1 = mongoose.createConnection(dbString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set("useFindAndModify", false);
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useCreateIndex", true);
mongoose.set("debug", true);
conn1.on("error", (err) => {
  console.log("Error while connection to Database", err);
});

var modelObject = require("./connectionModels")(conn1);

module.exports = conn1;
