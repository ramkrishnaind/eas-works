
const express = require('express');
const fs = require('fs');
var router = express.Router();

const path = require('path');
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/InvestWithUs';
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


const InvestWithUsFunction = require('./Routes/InvestWithUsModule/InvestWithUsManagement');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');


module.exports = function (conn) {
    // console.log(conn)
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(db);

    const pageMedia = [{
        name: 'image', maxCount: 1
    }, {
        name: 'bannerImage', maxCount: 1
    },
    {
        name: 'whatWeDoImages', maxCount: 10
    },
    {
        name: 'howToInvestImages', maxCount: 3
    }];

    router.post('/createInvestWithUs', userAuthMiddleware, upload.fields(pageMedia), InvestWithUsFunction.createInvestWithUsFunc(db));
    router.post('/updateInvestWithUs', userAuthMiddleware, upload.fields(pageMedia), InvestWithUsFunction.updateInvestWithUsFunc(db));
    router.post('/getInvestWithUsDetail', userAuthMiddleware, InvestWithUsFunction.getInvestWithUsDetailFunc(db));
    router.post('/getAllInvestWithUs', userAuthMiddleware, InvestWithUsFunction.getAllInvestWithUsFunc(db));
    router.post('/getActiveInvestWithUs', requestAuthMiddleware, InvestWithUsFunction.getActiveInvestWithUsFunc(db));
    router.post('/deleteInvestWithUs', userAuthMiddleware, InvestWithUsFunction.deleteInvestWithUsFunc(db));
    router.post('/updateInvestWithUsStatus', userAuthMiddleware, InvestWithUsFunction.updateInvestWithUsStatusFun(db));
    return router;
};