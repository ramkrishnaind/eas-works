
const express = require('express');
const fs = require('fs');
var router = express.Router();

const path = require('path');
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/blog';
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


const blogFunction = require('./Routes/BlogModule/BlogManagement');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');


module.exports = function (conn) {
    // console.log(conn)
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(db);

    const pageMedia = [{
        name: 'blogImage', maxCount: 3
    }, {
        name: 'bannerImage', maxCount: 3
    }];

    router.post('/createBlog', userAuthMiddleware, upload.fields(pageMedia), blogFunction.createBlogFunc(db));
    router.post('/updateBlog', userAuthMiddleware, upload.fields(pageMedia), blogFunction.updateBlogFunc(db));
    router.post('/getBlog', userAuthMiddleware, blogFunction.getBlogFunc(db));
    router.post('/getBlogDetail', userAuthMiddleware, blogFunction.getBlogDetailFunc(db));
    router.post('/getAllBlog', userAuthMiddleware, blogFunction.getAllBlogFunc(db));
    router.post('/getAllActiveBlog', requestAuthMiddleware, blogFunction.getAllBlogFunc(db));
    router.post('/deleteBlog', userAuthMiddleware, blogFunction.deleteBlogFunc(db));
    router.post('/updateBlogStatus', userAuthMiddleware, blogFunction.updateBlogStatusFun(db));
    router.post('/getBlogData', requestAuthMiddleware, blogFunction.getBlogDetailFunc(db));
    return router;
};