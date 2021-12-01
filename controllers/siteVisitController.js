
const express = require('express');
var router = express.Router();
const multer = require("multer");

const path = require('path');
let { createSiteVisitRequest, getSiteVisitRequest, updateSiteVisitStatusRequest } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createSiteVisitRequest',requestAuthMiddleware, createSiteVisitRequest(allCollection))
    router.post('/getSiteVisitRequest', userAuthMiddleware, getSiteVisitRequest(allCollection))
    router.post('/updateSiteVisitStatusRequest',userAuthMiddleware, updateSiteVisitStatusRequest(allCollection))
    
    return router;
};