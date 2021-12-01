
const express = require('express');
const path = require('path');
const fs = require('fs')
var router = express.Router();
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/slider';
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

let { createSlider, getSliderList, updateSliderStatus, updateSlider, deleteSlider, getSliderDetail } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createSlider', userAuthMiddleware, upload.array("image"), createSlider(allCollection))
    router.post('/getSliderList', userAuthMiddleware, getSliderList(allCollection))
    router.post('/updateSlider', userAuthMiddleware, upload.array("image"), updateSlider(allCollection))
    router.post('/updateSliderStatus', userAuthMiddleware, updateSliderStatus(allCollection))
    router.post('/deleteSlider', userAuthMiddleware, deleteSlider(allCollection))
    router.post('/getSliderDetail', userAuthMiddleware, getSliderDetail(allCollection))
    router.post('/getHomeSlider', requestAuthMiddleware, getSliderList(allCollection))

    return router;
};