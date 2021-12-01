
const express = require('express');

const fs = require('fs');
const path = require('path');
var router = express.Router();
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/services';
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
let { createServices, getServicesList, updateServicesStatus, updateServices, createServicesEnquiry, getServicesEnquiry, deleteServicesEnquiry, getServicesEnquiryList, updateServicesEnquiryStatus } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createServices', upload.array("services"), createServices(allCollection))
    router.post('/getServicesList', getServicesList(allCollection))
    router.post('/updateServices', upload.array("services"), updateServices(allCollection))
    router.post('/updateServicesStatus', updateServicesStatus(allCollection))

    router.post('/createServicesEnquiry', requestAuthMiddleware, upload.array("image"), createServicesEnquiry(allCollection))
    router.post('/getServicesEnquiry', requestAuthMiddleware, getServicesEnquiry(allCollection))
    router.post('/deleteServicesEnquiry', requestAuthMiddleware, deleteServicesEnquiry(allCollection))
    router.post('/getServicesEnquiryList', requestAuthMiddleware, getServicesEnquiryList(allCollection))
    router.post('/updateServicesEnquiryStatus', requestAuthMiddleware, updateServicesEnquiryStatus(allCollection))

    return router;
};