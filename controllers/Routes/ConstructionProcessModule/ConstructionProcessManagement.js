
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');
const bcrypt = require('bcryptjs');
const createTokenFunction = require('../../../Helper/createUniqueToken');
const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const { nanoid } = require('nanoid');

const createConstructionProcessSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string(),
    imagePosition: Joi.string().required()
});
const updateConstructionProcessSchema = Joi.object({
    _id: Joi.objectId().trim().required(),
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string(),
    imagePosition: Joi.string().required()
});
const getConstructionProcessSchema = Joi.object({
    _id: Joi.string().trim().required()
});
const updateConstructionProcessStatusSchema = Joi.object({
    _id: Joi.string().trim().required(),
    active: Joi.boolean().required(),
});

function createConstructionProcessHelper(Models) {
    async function createConstructionProcess(req, res) {
        try {

            let validateData = createConstructionProcessSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }

            // pick data from req.body
            let ConstructionProcessFormData = _.pick(req.body, ['title', 'description', "imagePosition", 'metaTitle', 'metaKeywords', 'metaDescription']);

            ConstructionProcessFormData.image = req.files;
            let saveConstructionProcess = await new Models.ConstructionProcessDB(ConstructionProcessFormData).save();
            console.log('saveConstructionProcess is ', saveConstructionProcess)
            saveConstructionProcess = saveConstructionProcess.toObject();

            res.send({ status: true, message: "New ConstructionProcess created successfully" });
        }
        catch (e) {
            console.log('createConstructionProcessHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Creating ConstructionProcess" });
        }
    }
    return createConstructionProcess;
}
/////////////update ConstructionProcess post/////////////
function updateConstructionProcessHelper(Models) {
    async function update(req, res) {
        try {

            let validateData = updateConstructionProcessSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ['_id', 'title', 'description', "imagePosition", 'metaTitle', 'metaKeywords', 'metaDescription']);


            let setData = {
                title: bodyData.title,
                description: bodyData.description,
                metaTitle: bodyData.metaTitle,
                metaKeywords: bodyData.metaKeywords,
                metaDescription: bodyData.metaDescription
            }
            setData['image'] = req.files

            let updateModule = await Models.ConstructionProcessDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: 'ConstructionProcess updated Successfully' });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in updating ConstructionProcess post" });
        }
    }
    return update;
}

function getAllConstructionProcessHelper(Models) {
    async function getAllConstructionProcess(req, res) {
        try {
            // Getting all ConstructionProcesss from Database
            let findData = await Models.ConstructionProcessDB.find().sort({ _id: -1 });
            if (findData.length) {
                // if data found check verified or not
                res.send({ status: true, message: "ConstructionProcesss List", data: findData });
            } else {
                res.send({ status: true, message: "No Data found for ConstructionProcesss" });
            }


        }
        catch (e) {
            console.log('createConstructionProcessHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getAllConstructionProcess;
}
function getAllActiveConstructionProcessFunc(Models) {
    async function getAllActiveConstructionProcess(req, res) {
        try {
            // Getting all ConstructionProcesss from Database
            let findData = await Models.ConstructionProcessDB.find({ active: true }).sort({ _id: -1 });
            if (findData.length) {
                // if data found check verified or not
                res.send({ status: true, message: "ConstructionProcesss For Client", data: findData });
            } else {
                res.send({ status: true, message: "No Data found for ConstructionProcesss for client" });
            }


        }
        catch (e) {
            console.log('createConstructionProcessHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getAllActiveConstructionProcess;
}
function getConstructionProcessHelper(Models) {
    async function getConstructionProcess(req, res) {
        try {
            let validateData = getConstructionProcessSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting ConstructionProcess from Database
            let findData = await Models.ConstructionProcessDB.findOne({ _id: req.body._id });
            console.log('findData is', findData)
            if (findData) {
                // if data found check verified or not
                res.send({ status: true, message: "ConstructionProcess Data", data: findData });
            } else {
                res.send({ status: true, message: "ConstructionProcess Data not found" });
            }


        }
        catch (e) {
            console.log('createConstructionProcessHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getConstructionProcess;
}
function updateConstructionProcessStatusHelper(Models) {
    async function updateConstructionProcessStatus(req, res) {
        try {
            let validateData = updateConstructionProcessStatusSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            let bodyData = _.pick(req.body, ["active", "_id"]);
            let setData = {
                active: bodyData.active,
            }
            let updateModule = await Models.ConstructionProcessDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS });


        }
        catch (e) {
            console.log('createConstructionProcessHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return updateConstructionProcessStatus;
}
function deleteConstructionProcessHelper(Models) {
    async function deleteConstructionProcess(req, res) {
        try {
            let validateData = getConstructionProcessSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting ConstructionProcess from Database
            let deleteData = await Models.ConstructionProcessDB.remove({ _id: req.body._id });
            console.log('deleteData is', deleteData)
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "ConstructionProcess Deleted Successfully" });
            } else {
                res.send({ status: true, message: "ConstructionProcess not found" });
            }


        }
        catch (e) {
            console.log('createConstructionProcessHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return deleteConstructionProcess;
}

module.exports = {
    createConstructionProcessFunc: createConstructionProcessHelper,
    updateConstructionProcessFunc: updateConstructionProcessHelper,
    getAllConstructionProcessFunc: getAllConstructionProcessHelper,
    updateConstructionProcessStatusFun: updateConstructionProcessStatusHelper,
    deleteConstructionProcessFunc: deleteConstructionProcessHelper,
    getConstructionProcessDetailFunc: getConstructionProcessHelper,
    getAllActiveConstructionProcessFunc
};