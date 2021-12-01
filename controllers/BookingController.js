
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
let { createBookingRequest, getBookingListRequest, getBookingForHome, updateBookingStatusRequest, getBookingDetails, updateBookingRequest } = require('./Routes');
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
    router.post('/createBooking', userAuthMiddleware, createBookingRequest(allCollection))
    router.post('/getBookingList', userAuthMiddleware, getBookingListRequest(allCollection))
    // router.post('/updateBooking', userAuthMiddleware, upload.fields(pageMedia), updateBookingRequest(allCollection))
    // router.post('/getBookingRequest', requestAuthMiddleware, getBookingRequest(allCollection))
    // router.post('/getBookingForHome', requestAuthMiddleware, getBookingForHome(allCollection))
    // router.post('/updateBookingStatusRequest', userAuthMiddleware, updateBookingStatusRequest(allCollection))
    // router.post('/updateBookingStatus', userAuthMiddleware, updateBookingStatusRequest(allCollection))

    // router.post('/getBookingDetails', userAuthMiddleware, getBookingDetails(allCollection))


    return router;
};