
const express = require('express');

const fs = require('fs')
var router = express.Router();
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/builder';
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
const path = require('path');
let { createBuilding, getBuildingList, getBuildingMaterials, updateBuildingStatus, updateBuilding, getBuildingItem, deleteBuildingItem } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createBuilding', userAuthMiddleware, upload.array("image"), createBuilding(allCollection))
    router.post('/getBuildingList', userAuthMiddleware, getBuildingList(allCollection))
    router.post('/getBuildingMaterials', requestAuthMiddleware, getBuildingMaterials(allCollection))
    router.post('/updateBuilding', userAuthMiddleware, upload.array("image"), updateBuilding(allCollection))
    router.post('/updateBuildingStatus', userAuthMiddleware, updateBuildingStatus(allCollection))
    router.post('/getBuildingItem', userAuthMiddleware, getBuildingItem(allCollection))
    router.post('/deleteBuildingItem', userAuthMiddleware, deleteBuildingItem(allCollection))

    return router;
};