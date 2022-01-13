const fs = require("fs");
const path = require("path");
// const readline = require("readline");
const { google } = require("googleapis");
// const { func } = require("joi");
// const { reject } = require("lodash");
// const { resolve } = require("path");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/contacts.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "./../token.json";

const getAuthClient = () => {
  const resultPromise = new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "../", "credentials.json"),
      (err, content) => {
        if (err) {
          console.log("Error loading client secret file:", err);
          reject(err);
        }
        // Authorize a client with credentials, then call the Google Tasks API.
        const { client_secret, client_id, redirect_uris } =
          JSON.parse(content).web;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uris[0]
        );
        resolve(oAuth2Client);
      }
    );
  });
  return resultPromise;
};
exports.getAuthUrl = async function () {
  const oAuth2Client = await getAuthClient();
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  return authUrl;
};
exports.getUserDetails = async function (code) {
  const resultPromise = new Promise(async (resolve, reject) => {
    const oAuth2Client = await getAuthClient();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error("Error retrieving access token", err);
        reject(err);
      }

      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      const service = google.people({ version: "v1", auth: oAuth2Client });
      service.people.connections.list(
        {
          resourceName: "people/me",
          pageSize: 10,
          personFields: "names,emailAddresses",
        },
        (err, res) => {
          if (err) {
            console.error("The API returned an error: " + err);
            reject(err);
          }
          console.log("res", res);
          const connections = res.data.connections;
          if (connections) {
            console.log("Connections:");
            const result = [];
            connections.forEach((person) => {
              if (person.names && person.names.length > 0) {
                console.log("person", person);
                result.push({
                  name: person.names[0].displayName,
                  email: person?.emailAddresses
                    ? person.emailAddresses[0].value
                    : "",
                  token,
                });
              } else {
                console.log("No display name found for connection.");
              }
            });
            resolve(result.length > 0 ? result[0] : null);
          } else {
            reject("No connections found.");
          }
        }
      );
    });
  });
  return resultPromise;
};
// Load client secrets from a local file.

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listConnectionNames(auth) {
  const service = google.people({ version: "v1", auth });
  service.people.connections.list(
    {
      resourceName: "people/me",
      pageSize: 10,
      personFields: "names,emailAddresses",
    },
    (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      const connections = res.data.connections;
      if (connections) {
        console.log("Connections:");
        connections.forEach((person) => {
          if (person.names && person.names.length > 0) {
            console.log(person.names[0].displayName);
          } else {
            console.log("No display name found for connection.");
          }
        });
      } else {
        console.log("No connections found.");
      }
    }
  );
}
