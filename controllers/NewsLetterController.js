
const express = require('express');
const fs = require('fs');
var router = express.Router();


const NewsLetterFunction = require('./Routes/NewsLetterModule/NewsLetterManagement');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');


module.exports = function (conn) {
    // console.log(conn)
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(db);

    router.post('/createNewsLetter', requestAuthMiddleware, NewsLetterFunction.createNewsLetterFunc(db));
    router.post('/getAllNewsLetter', userAuthMiddleware, NewsLetterFunction.getAllNewsLetterFunc(db));
    router.post('/deleteNewsLetter', userAuthMiddleware, NewsLetterFunction.deleteNewsLetterFunc(db));
    router.post('/updateNewsLetterStatus', userAuthMiddleware, NewsLetterFunction.updateNewsLetterStatusFun(db));
    return router;
};