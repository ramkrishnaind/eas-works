
const express = require('express');
const fs = require('fs');
var router = express.Router();

const path = require('path');
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/ConstructionProcess';
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


const ConstructionProcessFunction = require('./Routes/ConstructionProcessModule/ConstructionProcessManagement');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');


module.exports = function (conn) {
    // console.log(conn)
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(db);

    const pageMedia = [{
        name: 'image', maxCount: 1
    }];

    router.post('/createConstructionProcess', userAuthMiddleware, upload.fields(pageMedia), ConstructionProcessFunction.createConstructionProcessFunc(db));
    router.post('/updateConstructionProcess', userAuthMiddleware, upload.fields(pageMedia), ConstructionProcessFunction.updateConstructionProcessFunc(db));
    router.post('/getConstructionProcessDetail', userAuthMiddleware, ConstructionProcessFunction.getConstructionProcessDetailFunc(db));
    router.post('/getAllConstructionProcess', userAuthMiddleware, ConstructionProcessFunction.getAllConstructionProcessFunc(db));
    router.post('/getAllActiveConstructionProcess', requestAuthMiddleware, ConstructionProcessFunction.getAllActiveConstructionProcessFunc(db));
    router.post('/deleteConstructionProcess', userAuthMiddleware, ConstructionProcessFunction.deleteConstructionProcessFunc(db));
    router.post('/updateConstructionProcessStatus', userAuthMiddleware, ConstructionProcessFunction.updateConstructionProcessStatusFun(db));
    return router;
};