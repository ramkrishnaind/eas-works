
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorResponseHelper = require('../../../Helper/errorResponse');

const setNewPasswordSchema = Joi.object({
    userId: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
});

function reSetPassword(Models) {
    async function setNewPassword(req, res) {
        try {
            // console.log(req.sessionID)
            let payload = req.body;
            // validate data using joi
            let validateData = setNewPasswordSchema.validate(payload);
            if (validateData.error) {
                throw { status: false, error: validateData, message: "Invalid data", validationError: true };
            }

            let userData = await Models.UserDB.findOne({ _id: payload.userId }).lean();

            if (!userData) {
                throw { status: false, error: true, message: "Not authorised", statusCode: 401 };
            }
            let isValidPassword = await bcrypt.compare(payload.oldPassword, userData.password);
            if (!isValidPassword) {
                throw { status: false, error: true, message: "Old Password is incorrect", statusCode: 401, dataIncorrect: true };
            }
            let hash = await bcrypt.hash(payload.newPassword, 10);

            let setData = {
                password: hash
            }
            if (!userData.verified) {
                setData.verified = true;
                setData.verificationDate = new Date();
            }

            let updateUserData = await Models.UserDB.findOneAndUpdate({ _id: userData._id }, { $set: setData }, { new: true }).lean();

            if (!updateUserData) {
                throw { status: false, error: true, message: "Errow while updating new password", statusCode: 500 };
            }

            res.send({ status: true, message: "Password has been successfully updated" });
        }
        catch (e) {
            console.log('login err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in set new password" });
        }
    }
    return setNewPassword;
}
module.exports = reSetPassword;