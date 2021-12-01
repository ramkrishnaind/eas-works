
const express = require('express');

const fs = require('fs');
const path = require('path');
var router = express.Router();
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/Finance';
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
let { createFinance, getFinanceList, updateFinanceStatus, updateFinance, getFinanceData, deleteFinanceData, getFinanceDetail } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    const pageMedia = [{
        name: 'bankImage'
    }, {
        name: 'bannerImage', maxCount: 1
    }];

    router.post('/createFinance', userAuthMiddleware, upload.fields(pageMedia), createFinance(allCollection))
    router.post('/getFinanceList', userAuthMiddleware, getFinanceList(allCollection))
    router.post('/getFinanceData', requestAuthMiddleware, getFinanceData(allCollection))
    router.post('/getFinanceDetail', userAuthMiddleware, getFinanceDetail(allCollection))
    router.post('/updateFinance', userAuthMiddleware, upload.fields(pageMedia), updateFinance(allCollection))
    router.post('/updateFinanceStatus', userAuthMiddleware, updateFinanceStatus(allCollection))
    router.post('/deleteFinanceData', userAuthMiddleware, deleteFinanceData(allCollection))

    return router;
};