const _ = require('lodash');
const { CountryLite } = require('country-state-city-js')
const { StateLite } = require('country-state-city-js')
const { CityLite } = require('country-state-city-js')
const errorResponseHelper = require('../../../Helper/errorResponse');
function getCountries() {
  function getCountriesFunction(req, res) {
    const countries = CountryLite()
    res.send({
      status: true,
      message: "Countries data fetched successfully",
      countries,
    })
    //   {
    //     "name": "India",
    //     "code": "IN",
    //     "dialcode": "+91",
    //     "currency": "INR",
    //     "flag": "🇮🇳"
    // }
  }
  return getCountriesFunction
}
function getStates() {
  async function getStatesFunction(req, res) {
    let countryData = _.pick(req.body, ["countryCode"]);
    try {
      // console.log("countryData", countryData);
      const states = StateLite(countryData.countryCode)
      res.send({
        status: true,
        message: "State data fetched successfully",
        states,
      });
    } catch (e) {
      console.log("getStates err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting states data for country" + countryData.countryCode,
      });
    }
    //   {
    //     "name": "New York",
    //     "iso": "NY"
    // }
  }
  return getStatesFunction
}
function getCities() {
  async function getCitiesFunction(req, res) {
    let countryStateData = _.pick(req.body, ["countryCode", "stateCode"]);
    try {
      // console.log("countryData", countryData);
      const cities = CityLite(countryStateData.countryCode, countryStateData.stateCode)
      res.send({
        status: true,
        message: "Cities data fetched successfully",
        cities,
      });
    } catch (e) {
      console.log("getCities err", e);
      await errorResponseHelper({
        res,
        error: e,
        defaultMessage: "Error in getting cities data for country " + countryData.countryCode + " and State " + countryData.stateCOde,
      });
    }
    //   {
    //     "name": "New York",
    //     "iso": "NY"
    // }
  }
  return getCitiesFunction
}

module.exports = {
  getCountries,
  getStates,
  getCities
};
