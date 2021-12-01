
const express = require('express');
const fs = require('fs')
var router = express.Router();
const multer = require("multer");
const path = require('path');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(' image data is', req.body)
        let fpathId = 'uploads/property/' + req.body.propertyId;
        try {
            if (!fs.existsSync(fpathId)) {
                fs.mkdirSync(fpathId, { recursive: true }, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        } catch (err) {
            console.error('axios Error ', err)
        }
        cb(null, fpathId)
    },
    filename: (req, file, cb) => {
        req.body.imageFileName = (file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
let upload = multer({ storage: storage });

const propertyCommonHelper = require('./Routes/PropertyModule/propertyCommonHelper');
let { createPropertyRequest, getPropertyRequest, updatePropertyRequest, updatePropertyStatusRequest, exteriorImage,
    getUserIdPropertyList, updatePrice, getSearchPropertyList } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createPropertyRequest', userAuthMiddleware, createPropertyRequest(allCollection))
    router.post('/createProperty', requestAuthMiddleware, createPropertyRequest(allCollection))
    router.post('/updateProperty', userAuthMiddleware, updatePropertyRequest(allCollection))
    router.post('/deleteProperty', userAuthMiddleware, propertyCommonHelper.deleteProperty(allCollection))
    router.post('/propertyDetail', requestAuthMiddleware, propertyCommonHelper.propertyDetail(allCollection))
    router.post('/getPropertyDetail', userAuthMiddleware, propertyCommonHelper.propertyDetail(allCollection))
    router.post('/getAllProperty', userAuthMiddleware, propertyCommonHelper.getAllPropertyForAdmin(allCollection))
    router.post('/getAllPropertyForClient', requestAuthMiddleware, propertyCommonHelper.getAllProperty(allCollection))
    router.post('/getAllPropertyForHome', requestAuthMiddleware, propertyCommonHelper.getHomeAllProperty(allCollection))
    router.post('/getPropertyRequest', requestAuthMiddleware, getPropertyRequest(allCollection))
    router.post('/updatePropertyStatusRequest', userAuthMiddleware, updatePropertyStatusRequest(allCollection))
    router.post('/uploadImage', upload.array("image"), exteriorImage(allCollection))
    router.post('/getUserIdPropertyRequest', getUserIdPropertyList(allCollection))
    router.post('/updatePrice', updatePrice(allCollection))
    router.post('/getSearchPropertyList', requestAuthMiddleware, getSearchPropertyList(allCollection))
    router.post('/getSearchTerms', requestAuthMiddleware, propertyCommonHelper.getSearchTerms(allCollection))
    router.post('/getPropertyLatLong', requestAuthMiddleware, propertyCommonHelper.getPropertyLatLong(allCollection))
    router.post('/getsearchMinMax', requestAuthMiddleware, propertyCommonHelper.getsearchMinMax(allCollection))
    router.post('/getPropertyByType', requestAuthMiddleware, propertyCommonHelper.getPropertyByType(allCollection))


    return router;
};