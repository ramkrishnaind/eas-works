const googleAPIs = require("googleapis");
const { google } = googleAPIs;
const googleConfig = {
  clientId:
    "243499270913-1q6i3qjn2q7n9a7fb0383alg2fetd7it.apps.googleusercontent.com", // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: "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", // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: "http://localhost:3334", // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}
/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
  "https://www.googleapis.com/auth/plus.me",
  "https://www.googleapis.com/auth/userinfo.email",
];

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope,
  });
}
function getGooglePlusApi(auth) {
  return google.plus({ version: "v1", auth });
}
/**
 * Create the google url to be sent to the client.
 */
exports.urlGoogle = function () {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
};

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
exports.getGoogleAccountFromCode = async function (code) {
  const auth = createConnection(); // this is from previous step
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  // const auth = createConnection();
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({ userId: "me" });
  const userGoogleId = me.data.id;
  const userGoogleEmail =
    me.data.emails && me.data.emails.length && me.data.emails[0].value;
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens,
  };
};
