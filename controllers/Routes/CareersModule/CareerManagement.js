
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');
const bcrypt = require('bcryptjs');
const createTokenFunction = require('../../../Helper/createUniqueToken');
const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const { nanoid } = require('nanoid');
const sendSupplierMailHelper = require('../../../Helper/sendSupplierMailHelper');

const createCareerSchema = Joi.object({
    degination: Joi.string().trim().required(),
    department: Joi.string().trim(),
    vacancy: Joi.number().required(),
    experiance: Joi.string().required(),
    location: Joi.string().required(),
    desctiption: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string()
});
const updateCareerSchema = Joi.object({
    _id: Joi.objectId().trim().required(),
    degination: Joi.string().trim().required(),
    department: Joi.string().trim(),
    vacancy: Joi.number().required(),
    experiance: Joi.string().required(),
    location: Joi.string().required(),
    desctiption: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string()
});
const getCareerSchema = Joi.object({
    _id: Joi.string().trim().required()
});
const updateCareerStatusSchema = Joi.object({
    _id: Joi.string().trim().required(),
    active: Joi.boolean().required(),
});
const jobApplicationSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim(),
    mobile: Joi.number().required(),
    qualification: Joi.string().required(),
    careerID: Joi.string().trim().required(),
    email: Joi.string().required(),
    message: Joi.string()
});
const updateJobApplicationSchema = Joi.object({
    _id: Joi.string().trim().required(),
    status: Joi.number().required(),
});
function createCareerHelper(Models) {
    async function createCareer(req, res) {
        try {

            let validateData = createCareerSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }

            // pick data from req.body
            let careerFormData = _.pick(req.body, ['degination', 'department', 'vacancy', 'experiance', 'location', 'desctiption', 'metaTitle', 'metaKeywords', 'metaDescription']);

            let saveCareer = await new Models.CareerDB(careerFormData).save();
            saveCareer = saveCareer.toObject();

            res.send({ status: true, message: "New Job post created successfully" });
        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Creating job post" });
        }
    }
    return createCareer;
}
/////////////update Career post/////////////
function updateCareerHelper(Models) {
    async function update(req, res) {
        try {

            let validateData = updateCareerSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ["_id", 'degination', 'department', 'vacancy', 'experiance', 'location', 'desctiption', 'metaTitle', 'metaKeywords', 'metaDescription']);
            console.log('bodyData is', bodyData)
            let setData = {
                degination: bodyData.degination,
                department: bodyData.department,
                vacancy: bodyData.vacancy,
                experiance: bodyData.experiance,
                location: bodyData.location,
                desctiption: bodyData.desctiption,
                metaTitle: bodyData.metaTitle,
                metaKeywords: bodyData.metaKeywords,
                metaDescription: bodyData.metaDescription
            }

            let updateModule = await Models.CareerDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: 'Job Post updated Successfully' });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in updating Career post" });
        }
    }
    return update;
}

function getAllCareerHelper(Models) {
    async function getAllCareer(req, res) {
        try {
            // Getting all Careers from Database
            let findData = await Models.CareerDB.find().sort({ _id: -1 });
            if (findData.length) {
                // if data found check verified or not
                res.send({ status: true, message: "Careers List", data: findData });
            } else {
                res.send({ status: true, message: "No Data found for Careers" });
            }


        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getAllCareer;
}
function getCareerHelper(Models) {
    async function getCareer(req, res) {
        try {
            let validateData = getCareerSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Career from Database
            let findData = await Models.CareerDB.findOne({ _id: req.body._id }).sort({ _id: -1 });
            console.log('findData is', findData)
            if (findData) {
                // if data found check verified or not
                res.send({ status: true, message: "Career Data", data: findData });
            } else {
                res.send({ status: true, message: "Career Data not found" });
            }


        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getCareer;
}
function updateCareerStatusHelper(Models) {
    async function updateCareerStatus(req, res) {
        try {
            let validateData = updateCareerStatusSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            let bodyData = _.pick(req.body, ["active", "_id"]);
            let setData = {
                active: bodyData.active,
            }
            let updateModule = await Models.CareerDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS });


        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return updateCareerStatus;
}
function deleteCareerHelper(Models) {
    async function deleteCareer(req, res) {
        try {
            let validateData = getCareerSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Career from Database
            let deleteData = await Models.CareerDB.remove({ _id: req.body._id });
            console.log('deleteData is', deleteData)
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "Career Deleted Successfully" });
            } else {
                res.send({ status: true, message: "Career not found" });
            }


        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return deleteCareer;
}
function applyForJob(Models) {
    async function apply(req, res) {
        try {

            let validateData = jobApplicationSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }

            // pick data from req.body
            let jobFormData = _.pick(req.body, ['firstName', 'lastName', 'qualification', 'careerID', 'email', 'mobile', 'message']);
            jobFormData.resume = req.files;
            let saveJob = await new Models.JobApplicationDB(jobFormData).save();
            saveJob = saveJob.toObject();
            await sendJobApplicationToMail(saveJob, Models);
            res.send({ status: true, message: "Applied successfully.!" });
        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error While Applying to Job" });
        }
    }
    return apply;
}
function updateApplicationStatus(Models) {
    async function updatStatus(req, res) {
        try {
            let validateData = updateJobApplicationSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            let bodyData = _.pick(req.body, ["status", "_id"]);
            let setData = {
                status: bodyData.status,
            }
            let updateModule = await Models.JobApplicationDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS });


        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return updatStatus;
}
function getAllApplication(Models) {
    async function getAllData(req, res) {
        try {
            // Getting all Careers from Database
            let findData = await Models.JobApplicationDB.find().populate('careerID').sort({ _id: -1 });
            if (findData.length) {
                // if data found check verified or not
                res.send({ status: true, message: "Application List", data: findData });
            } else {
                res.send({ status: true, message: "No Data found for Careers" });
            }


        }
        catch (e) {
            console.log('createCareerHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in getting data" });
        }
    }
    return getAllData;
}
async function sendJobApplicationToMail(data, Models) {
    try {
        let filePath = path.join(__dirname, '/../../../Template/jobApplication.html');
        let careerData = await Models.CareerDB.findOne({ _id: data.careerID }).lean();
        let replacements = {
            name: `${_.capitalize(data.firstName)}` +' '+ `${_.capitalize(data.lastName)}`,
            qualification: `${_.capitalize(data.qualification)}`,
            appliedFor: careerData.degination,
            mobile: data.mobile,
            email: data.email,
            message: data.message
        }
        console.log('careerData is ', careerData)
        let attachments = [];
        let apiUrl = 'https://api.vishalconstructioncompany.com/'
        for (let x = 0; x < data.resume.length; x++){
            let item = data.resume[x]
            let obj = {};
            obj.path = apiUrl + item.path ;
            attachments. push(obj);
        }
        //let info = await prepareTemplateAndMailHelper({ filePath, replacements, to: data.email, subject: "New Supplier Request For VCC" });
        let info = await sendSupplierMailHelper({ filePath, replacements, to: "info@vishalconstructioncompany.com", subject: "New Job Application for VCC", attachments, from: data.email });
        return info;
    }
    catch (e) {
        console.log('error', e);
    }
}

module.exports = {
    createCareerFunc: createCareerHelper,
    updateCareerFunc: updateCareerHelper,
    getAllCareerFunc: getAllCareerHelper,
    getCareerFunc: getCareerHelper,
    updateCareerStatusFun: updateCareerStatusHelper,
    deleteCareerFunc: deleteCareerHelper,
    getCareerDetailFunc: getCareerHelper,
    applyForJob,
    updateApplicationStatus,
    getAllApplication
};