
const express = require('express');

const fs = require('fs')
var router = express.Router();
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/cms';
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
        // req.body.imageFileName = (file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
let upload = multer({ storage: storage });
const path = require('path');
let { createCMS, getCMSList, updateCMSStatus, updateCMS, getCMS, deleteCMS, getCMSPages } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);
    const pageMedia = [{
        name: 'image'
    }];
    router.post('/createCMS', userAuthMiddleware, upload.fields(pageMedia), createCMS(allCollection))
    router.post('/getCMSList', userAuthMiddleware, getCMSList(allCollection))
    router.post('/getCMSDetail', userAuthMiddleware, getCMS(allCollection))
    router.post('/deleteCMS', userAuthMiddleware, deleteCMS(allCollection))
    router.post('/getLocationPages', requestAuthMiddleware, getCMSPages(allCollection, 'Location'))
    router.post('/getBottomPages', requestAuthMiddleware, getCMSPages(allCollection, 'Bottom'))
    router.post('/updateCMS', userAuthMiddleware, upload.fields(pageMedia), updateCMS(allCollection))
    router.post('/updateCMSStatus', userAuthMiddleware, updateCMSStatus(allCollection))

    return router;
};