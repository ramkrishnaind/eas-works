
const express = require('express');

var router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fpathId = 'uploads/jobApplication';
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




const careerFunction = require('./Routes/CareersModule/CareerManagement');
const userAuthMiddlewareFunction = require('../Middleware/userAuth');


module.exports = function (conn) {
    // console.log(conn)
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const userAuthMiddleware = userAuthMiddlewareFunction.userAuthMiddleware(db);
    const requestAuthMiddleware = userAuthMiddlewareFunction.requestAuthMiddleware(db);

    router.post('/createCareer', userAuthMiddleware, careerFunction.createCareerFunc(db));
    router.post('/updateCareer', userAuthMiddleware, careerFunction.updateCareerFunc(db));
    router.post('/getCareer', userAuthMiddleware, careerFunction.getCareerFunc(db));
    router.post('/getCareerDetail', userAuthMiddleware, careerFunction.getCareerDetailFunc(db));
    router.post('/getAllCareer', userAuthMiddleware, careerFunction.getAllCareerFunc(db));
    router.post('/getAllActiveCareer', requestAuthMiddleware, careerFunction.getAllCareerFunc(db));
    router.post('/deleteCareer', userAuthMiddleware, careerFunction.deleteCareerFunc(db));
    router.post('/updateCareerStatus', userAuthMiddleware, careerFunction.updateCareerStatusFun(db));
    router.post('/applyForJob', requestAuthMiddleware, upload.array("resume"), careerFunction.applyForJob(db));
    router.post('/updateApplicationStatus', userAuthMiddleware, careerFunction.updateApplicationStatus(db));
    router.post('/JobApplications', userAuthMiddleware, careerFunction.getAllApplication(db));
    return router;
};