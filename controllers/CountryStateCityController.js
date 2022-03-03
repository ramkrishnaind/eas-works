const express = require("express");

var router = express.Router();
const countryStateCityFile = require("./Routes/CountryStateCityModule/CountryStateCityManagement");
console.log("countryStateCityFile", countryStateCityFile);
module.exports = function (conn) {
  // console.log(conn)
  router.get(
    "/getCountries",
    countryStateCityFile.getCountries()
  );
  router.post(
    "/getStates",
    countryStateCityFile.getStates()
  );
  router.post(
    "/getCities",
    countryStateCityFile.getCities()
  );

  return router;
};
