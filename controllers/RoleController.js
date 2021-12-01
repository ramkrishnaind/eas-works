const express = require("express");
var router = express.Router();
const userAuthMiddlewareFunction = require("../Middleware/userAuth");

let {
  createUserRoleFunction,
  updateStatusUserRoleFunction,
  userRoleListFunction,
} = require("./Routes");

module.exports = function (conn) {
  const allCollection = require("../Database/getCollections")(
    conn.MongoDBConnection
  );
  const userAuthMiddleware =
    userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
  const requestAuthMiddleware =
    userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

  router.post("/createUserRole", createUserRoleFunction(allCollection));
  router.post(
    "/updateStatusUserRole",
    userAuthMiddleware,
    updateStatusUserRoleFunction(allCollection)
  );
  router.post(
    "/userRoleList",
    userAuthMiddleware,
    userRoleListFunction.userRoleList(allCollection)
  );
  router.post(
    "/userRoleDetails",
    userAuthMiddleware,
    userRoleListFunction.userRoleDetails(allCollection)
  );
  router.post(
    "/userRoleDelete",
    userAuthMiddleware,
    userRoleListFunction.userRoleDelete(allCollection)
  );

  return router;
};
