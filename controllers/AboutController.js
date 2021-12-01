
const express = require('express');

const fs = require('fs');
const path = require('path');
var router = express.Router();
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/AboutPage';
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
let { createAboutPage, getAboutPageList, updateAboutPageStatus, updateAboutPage, getAboutPageData, deleteAboutPageData, getAboutPageDetail } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createAboutPage', userAuthMiddleware, upload.array("image"), createAboutPage(allCollection))
    router.post('/getAboutPageList', userAuthMiddleware, getAboutPageList(allCollection))
    router.post('/getAboutPageData', requestAuthMiddleware, getAboutPageData(allCollection))
    router.post('/getAboutPageDetail', userAuthMiddleware, getAboutPageDetail(allCollection))
    router.post('/updateAboutPage', userAuthMiddleware, upload.array("image"), updateAboutPage(allCollection))
    router.post('/updateAboutPageStatus', userAuthMiddleware, updateAboutPageStatus(allCollection))
    router.post('/deleteAboutPageData', userAuthMiddleware, deleteAboutPageData(allCollection))

    return router;
};