
const express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require('path');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/feadback';
        try {
            if (!fs.existsSync(fpathId)) {
                fs.mkdirSync(fpathId, { recursive: true }, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        } catch (err) {
            console.error(err)
        }
        cb(null, fpathId)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
let upload = multer({ storage: storage });
let { createFeedbackRequest, getFeedbackRequest, getFeedbackForHome, updateFeedbackStatusRequest, getFeedbackDetails, updateFeedbackRequest, deleteFeedback } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);
    const pageMedia = [{
        name: 'iconImage', maxCount: 1
    }, {
        name: 'image', maxCount: 3
    }
    ];
    router.post('/createFeedback', userAuthMiddleware, upload.fields(pageMedia), createFeedbackRequest(allCollection))
    router.post('/updateFeedback', userAuthMiddleware, upload.fields(pageMedia), updateFeedbackRequest(allCollection))
    router.post('/getFeedbackRequest', requestAuthMiddleware, getFeedbackRequest(allCollection))
    router.post('/getFeedbackForHome', requestAuthMiddleware, getFeedbackForHome(allCollection))
    router.post('/updateFeedbackStatusRequest', userAuthMiddleware, updateFeedbackStatusRequest(allCollection))
    router.post('/updateFeedbackStatus', userAuthMiddleware, updateFeedbackStatusRequest(allCollection))
    router.post('/getFeedbackList', userAuthMiddleware, getFeedbackRequest(allCollection))
    router.post('/getFeedbackDetails', userAuthMiddleware, getFeedbackDetails(allCollection))
    router.post('/deleteFeedback', userAuthMiddleware, deleteFeedback(allCollection))


    return router;
};