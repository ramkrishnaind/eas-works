
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

let { createTeamMember, getTeamList, updateTeamMember, updateTeamMemberStatus, deleteTeamMember, getTeamMemberDetail, getClientTeamMember } = require('./Routes');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');

module.exports = function (conn) {
    // console.log(conn)
    const allCollection = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(allCollection);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(allCollection);

    router.post('/createTeamMember', userAuthMiddleware, upload.array("image"), createTeamMember(allCollection, false))
    router.post('/createDirector', userAuthMiddleware, upload.array("image"), createTeamMember(allCollection, true))
    router.post('/getTeamList', userAuthMiddleware, getTeamList(allCollection, false))
    router.post('/getDirectorList', userAuthMiddleware, getTeamList(allCollection, true))
    router.post('/updateTeamMember', userAuthMiddleware, upload.array("image"), updateTeamMember(allCollection))
    router.post('/updateDirector', userAuthMiddleware, upload.array("image"), updateTeamMember(allCollection))
    router.post('/updateTeamMemberStatus', userAuthMiddleware, updateTeamMemberStatus(allCollection))
    router.post('/updateDirectorStatus', userAuthMiddleware, updateTeamMemberStatus(allCollection))
    router.post('/deleteTeamMember', userAuthMiddleware, deleteTeamMember(allCollection))
    router.post('/deleteDirector', userAuthMiddleware, deleteTeamMember(allCollection))
    router.post('/getTeamMemberDetail', userAuthMiddleware, getTeamMemberDetail(allCollection))
    router.post('/getDirectorDetail', userAuthMiddleware, getTeamMemberDetail(allCollection))
    router.post('/getClientTeamMember', requestAuthMiddleware, getClientTeamMember(allCollection, false))
    router.post('/getDirector', requestAuthMiddleware, getClientTeamMember(allCollection, true))

    return router;
};