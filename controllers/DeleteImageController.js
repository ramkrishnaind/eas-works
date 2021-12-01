
const express = require('express');

const fs = require('fs');
const path = require('path');
var router = express.Router();

let { deleteImage } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);

    router.post('/deleteImage', userAuthMiddleware, deleteImage(allCollection))
    return router;
};