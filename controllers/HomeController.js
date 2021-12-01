
const express = require('express');
const fs = require('fs');
var router = express.Router();

const path = require('path');
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/home';
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
let bannerUpload = multer({ storage: storage });


const homeFunction = require('./Routes/HomeModule/HomeManagement');
const footerFunction = require('./Routes/HomeModule/FooterManagement');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');
let { dashBoardFunction } = require('./Routes');


module.exports = function (conn) {
    // console.log(conn)
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(db);
    const pageMedia = [{
        name: 'image'
    }, {
        name: 'banner'
    }, {
        name: 'video'
    }
    ];
    const serviceMedia = [{
        name: 'image'
    }, {
        name: 'banner'
    }
    ];
    const imageVideo = [{
        name: 'image'
    }, {
        name: 'video'
    }];
    router.post('/createAboutSection', userAuthMiddleware, upload.array("aboutImages"), homeFunction.createAboutSection(db));
    router.post('/updateAboutSection', userAuthMiddleware, upload.array("aboutImages"), homeFunction.updateAboutSection(db));
    router.post('/homeAbout', userAuthMiddleware, homeFunction.getHomeAboutHelper(db));

    router.post('/createMovingBanner', userAuthMiddleware, upload.array("backgroundImage"), homeFunction.createMovingBanner(db));
    router.post('/updateMovingBanner', userAuthMiddleware, upload.array("backgroundImage"), homeFunction.updateMovingBanner(db));
    router.post('/movingBanner', userAuthMiddleware, homeFunction.getMovingBanner(db));

    router.post('/createDealingIn', userAuthMiddleware, upload.fields(imageVideo), homeFunction.createDealingIn(db));
    router.post('/updateDealingIn', userAuthMiddleware, upload.fields(imageVideo), homeFunction.updateDealingIn(db));

    //
    router.post('/createDealingInItem', userAuthMiddleware, upload.fields(pageMedia), homeFunction.createDealingInItem(db));
    router.post('/getDealingList', userAuthMiddleware, homeFunction.getDealingList(db));
    router.post('/getDealingInDetails', userAuthMiddleware, homeFunction.getDealingInDetails(db));
    router.post('/deleteDealingIn', userAuthMiddleware, homeFunction.deleteDealingIn(db));
    router.post('/updateDealingInItem', userAuthMiddleware, upload.fields(pageMedia), homeFunction.updateDealingInItem(db));
    router.post('/updateDealingInStatusHelper', userAuthMiddleware, homeFunction.updateDealingInStatusHelper(db));

    router.post('/getDealingItemList', userAuthMiddleware, homeFunction.getDealingItemList(db));
    router.post('/getDealingItem', userAuthMiddleware, homeFunction.getDealingInItemDetails(db));
    router.post('/deleteDealingItem', userAuthMiddleware, homeFunction.deleteDealingItem(db));
    router.post('/updateDealingInItemStatusHelper', userAuthMiddleware, homeFunction.updateDealingInItemStatusHelper(db));



    // 
    router.post('/createService', userAuthMiddleware, homeFunction.createService(db));
    router.post('/getServiceList', userAuthMiddleware, homeFunction.getServiceList(db));
    router.post('/getServiceDetail', userAuthMiddleware, homeFunction.getServiceDetail(db));
    router.post('/updateService', userAuthMiddleware, homeFunction.updateService(db));
    router.post('/deleteService', userAuthMiddleware, homeFunction.deleteService(db));
    router.post('/updateServiceStatusHelper', userAuthMiddleware, homeFunction.updateServiceStatusHelper(db));
    //
    router.post('/createServiceItem', userAuthMiddleware, upload.fields(serviceMedia), homeFunction.createServiceItem(db));
    router.post('/updateServiceItem', userAuthMiddleware, upload.fields(serviceMedia), homeFunction.updateServiceItem(db));
    router.post('/getServiceItemList', userAuthMiddleware, homeFunction.getServiceItemList(db));
    router.post('/getServiceItem', userAuthMiddleware, homeFunction.getServiceItemDetails(db));
    router.post('/deleteServiceItem', userAuthMiddleware, homeFunction.deleteServiceItem(db));
    router.post('/updateServiceItemStatus', userAuthMiddleware, homeFunction.updateServiceItemStatusHelper(db));


    // Dashboard 
    router.post('/dashboard', userAuthMiddleware, dashBoardFunction(db));



    //Api For Client Side
    router.post('/getHomeAbout', requestAuthMiddleware, homeFunction.getHomeAboutHelper(db));
    router.post('/getMovingBanner', requestAuthMiddleware, homeFunction.getMovingBanner(db));
    router.post('/getDealingIn', requestAuthMiddleware, homeFunction.getDealingInForHome(db));
    router.post('/getDealingInItem', requestAuthMiddleware, homeFunction.getDealingInItemDetails(db));
    router.post('/getService', requestAuthMiddleware, homeFunction.getServiceForHome(db));
    router.post('/getServiceDetails', requestAuthMiddleware, homeFunction.getServiceItemDetails(db));
    //router.post('/applyForJob', userAuthMiddleware, homeFunction.createHomeFunc(db));

    //Footer Address
    router.post('/createVishalAddress', userAuthMiddleware, footerFunction.createVishalAddress(db));
    router.post('/updateVishalAddress', userAuthMiddleware, footerFunction.updateVishalAddress(db));
    router.post('/getVishalAddress', userAuthMiddleware, footerFunction.getVishalAddress(db));
    router.post('/getFooterAddress', requestAuthMiddleware, footerFunction.getVishalAddress(db));

    //Footer Social Media Linls
    router.post('/createSocialMedia', userAuthMiddleware, footerFunction.createSocialMedia(db));
    router.post('/updateSocialMedia', userAuthMiddleware, footerFunction.updateSocialMedia(db));
    router.post('/getSocialMedia', userAuthMiddleware, footerFunction.getSocialMedia(db));
    router.post('/getFooterSocialMedia', requestAuthMiddleware, footerFunction.getSocialMedia(db));
    return router;
};