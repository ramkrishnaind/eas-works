
const express = require('express');
var router = express.Router();
const multer = require("multer");

const path = require('path');
let { createCallbackRequest, getCallbackRequest, updateCallbackStatusRequest } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createCallbackRequest', requestAuthMiddleware, createCallbackRequest(allCollection))
    router.post('/getCallbackRequest', requestAuthMiddleware, userAuthMiddleware, getCallbackRequest(allCollection))
    router.post('/updateCallbackStatusRequest', userAuthMiddleware, updateCallbackStatusRequest(allCollection))

    return router;
};