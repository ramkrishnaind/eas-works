
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prepareTemplateSendMail } = require('./signup');
const errorResponseHelper = require('../../../Helper/errorResponse');

function logInHelper(Models) {
    async function logIn(req, res) {
        try {

            if (!req.session || !req.session.user || !req.session.user) {
                return res.send({ status: true, message: "Successfully logout", tokenNotFound: true });
            }

            let token = req.session.user.token;
            delete req.session.user;
            let deleteToken = await Models.AuthTokenDB.deleteOne({ token });
            console.log('deleteToken', deleteToken);

            res.send({ status: true, message: "Successfully logout" });
        }
        catch (e) {
            console.log('login err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Login" });
        }
    }
    return logIn;
}
module.exports = logInHelper;