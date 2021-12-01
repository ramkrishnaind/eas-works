
const express = require('express');
var router = express.Router();
const multer = require("multer");

const path = require('path');
let { createReviewRequest, getReviewRequest, updateReviewStatusRequest } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createReviewRequest', requestAuthMiddleware, createReviewRequest(allCollection))
    router.post('/getReviewRequest', getReviewRequest(allCollection))
    router.post('/updateReviewStatusRequest', userAuthMiddleware, updateReviewStatusRequest(allCollection))

    return router;
};