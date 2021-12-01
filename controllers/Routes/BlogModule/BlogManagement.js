
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');
const bcrypt = require('bcryptjs');
const createTokenFunction = require('../../../Helper/createUniqueToken');
const errorResponseHelper = require('../../../Helper/errorResponse');
const CONSTANTSMESSAGE = require('../../../Helper/constantsMessage')
const { nanoid } = require('nanoid');

const createBlogSchema = Joi.object({
    title: Joi.string().trim().required(),
    sortDescription: Joi.string().trim(),
    description: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string()
});
const updateBlogSchema = Joi.object({
    _id: Joi.objectId().trim().required(),
    title: Joi.string().trim().required(),
    sortDescription: Joi.string().trim(),
    description: Joi.string().required(),
    metaTitle: Joi.string(),
    metaKeywords: Joi.string(),
    metaDescription: Joi.string()
});
const getBlogSchema = Joi.object({
    _id: Joi.string().trim().required()
});
const updateBlogStatusSchema = Joi.object({
    _id: Joi.string().trim().required(),
    active: Joi.boolean().required(),
});

function createBlogHelper(Models) {
    async function createBlog(req, res) {
        try {

            let validateData = createBlogSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }

            // pick data from req.body
            let blogFormData = _.pick(req.body, ['title', 'sortDescription', 'description', 'metaTitle', 'metaKeywords', 'metaDescription']);

            blogFormData.blogImage = req.files;
            let saveBlog = await new Models.BlogDB(blogFormData).save();
            console.log('saveBlog is ', saveBlog)
            saveBlog = saveBlog.toObject();

            res.send({ status: true, message: "New Blog created successfully" });
        }
        catch (e) {
            console.log('createBlogHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Creating Blog" });
        }
    }
    return createBlog;
}
/////////////update Blog post/////////////
function updateBlogHelper(Models) {
    async function update(req, res) {
        try {

            let validateData = updateBlogSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: CONSTANTSMESSAGE.INVALID_DATA };
            }

            // pick data from req.body

            let bodyData = _.pick(req.body, ['title', 'sortDescription', 'description', 'metaTitle', 'metaKeywords', 'metaDescription']);


            let setData = {
                title: bodyData.title,
                sortDescription: bodyData.sortDescription,
                description: bodyData.description,
                metaTitle: bodyData.metaTitle,
                metaKeywords: bodyData.metaKeywords,
                metaDescription: bodyData.metaDescription
            }
            let blogMedia = req.files;
            setData['blogImage'] = blogMedia.blogImage;
            setData['bannerImage'] = blogMedia.bannerImage;

            let updateModule = await Models.BlogDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: 'Blog updated Successfully' });
        }
        catch (e) {
            console.log('saveModule err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in updating Blog post" });
        }
    }
    return update;
}

function getAllBlogHelper(Models) {
    async function getAllBlog(req, res) {
        try {
            // Getting all Blogs from Database
            let findData = await Models.BlogDB.find().sort({ _id: -1 });
            if (findData.length) {
                // if data found check verified or not
                res.send({ status: true, message: "Blogs List", data: findData });
            } else {
                res.send({ status: true, message: "No Data found for Blogs" });
            }


        }
        catch (e) {
            console.log('createBlogHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getAllBlog;
}
function getBlogHelper(Models) {
    async function getBlog(req, res) {
        try {
            let validateData = getBlogSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Blog from Database
            let findData = await Models.BlogDB.findOne({ _id: req.body._id });
            console.log('findData is', findData)
            if (findData) {
                // if data found check verified or not
                res.send({ status: true, message: "Blog Data", data: findData });
            } else {
                res.send({ status: true, message: "Blog Data not found" });
            }


        }
        catch (e) {
            console.log('createBlogHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return getBlog;
}
function updateBlogStatusHelper(Models) {
    async function updateBlogStatus(req, res) {
        try {
            let validateData = updateBlogStatusSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            let bodyData = _.pick(req.body, ["active", "_id"]);
            let setData = {
                active: bodyData.active,
            }
            let updateModule = await Models.BlogDB.findOneAndUpdate({ _id: bodyData._id }, { $set: setData });
            console.log('updateModule is', updateModule)
            res.send({ status: true, message: CONSTANTSMESSAGE.STATUS_UPDATE_SUCCESS });


        }
        catch (e) {
            console.log('createBlogHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return updateBlogStatus;
}
function deleteBlogHelper(Models) {
    async function deleteBlog(req, res) {
        try {
            let validateData = getBlogSchema.validate(req.body);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data" };
            }


            // Getting Blog from Database
            let deleteData = await Models.BlogDB.remove({ _id: req.body._id });
            console.log('deleteData is', deleteData)
            if (deleteData) {
                // if data found check verified or not
                res.send({ status: true, message: "Blog Deleted Successfully" });
            } else {
                res.send({ status: true, message: "Blog not found" });
            }


        }
        catch (e) {
            console.log('createBlogHelper err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in SignUp" });
        }
    }
    return deleteBlog;
}

module.exports = {
    createBlogFunc: createBlogHelper,
    updateBlogFunc: updateBlogHelper,
    getAllBlogFunc: getAllBlogHelper,
    getBlogFunc: getBlogHelper,
    updateBlogStatusFun: updateBlogStatusHelper,
    deleteBlogFunc: deleteBlogHelper,
    getBlogDetailFunc: getBlogHelper
};