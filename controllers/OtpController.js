
const express = require('express');

const fs = require('fs')
var router = express.Router();
const path = require('path');
let { createOTP, verifyOTP } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createOTP', requestAuthMiddleware, createOTP(allCollection))
    router.post('/verifyOTP', requestAuthMiddleware, verifyOTP(allCollection))

    return router;
};