
const express = require('express');

const fs = require('fs')
var router = express.Router();
const path = require('path');
let { createContactUs, getContactUsList, updateContactUsStatus, updateContactUs } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createContactUs', requestAuthMiddleware, createContactUs(allCollection))
    router.post('/getContactUsList', userAuthMiddleware, getContactUsList(allCollection))
    router.post('/updateContactUs', userAuthMiddleware, updateContactUs(allCollection))
    router.post('/updateContactUsStatus', userAuthMiddleware, updateContactUsStatus(allCollection))

    return router;
};