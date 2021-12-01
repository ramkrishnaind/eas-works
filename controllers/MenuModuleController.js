
const express = require('express');
var router = express.Router();
const multer = require("multer");

const path = require('path');
let { createMenu, getMenuList, uploadFileFunction, getAllMenuList, updateMenuStatus, getMenuData, updateMenu } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log("file.fieldname  ", file.fieldname);
        console.log("final file name :::   ", Date.now() + path.extname(file.originalname));
        req.body.imageFileName = (file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
let upload = multer({ storage: storage });

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createMenu', userAuthMiddleware, createMenu(allCollection))
    router.post('/getMenuList', userAuthMiddleware, getMenuList(allCollection))
    router.post('/getAllMenuList', userAuthMiddleware, getAllMenuList(allCollection))
    router.post('/updateMenuStatus', userAuthMiddleware, updateMenuStatus(allCollection))
    router.post('/updateMenu', userAuthMiddleware, updateMenu(allCollection))
    router.post('/getMenuData', userAuthMiddleware, getMenuData(allCollection))
    router.post("/upload_files", upload.array("files"), uploadFileFunction(allCollection));

    return router;
};