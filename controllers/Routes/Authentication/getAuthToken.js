
const errorResponseHelper = require('../../../Helper/errorResponse');

function getAuthToken(Models) {
    async function getAuth(req, res) {
        try {
            res.send({ status: true, user: req.session.user });
        }
        catch (e) {
            console.log('getAuth err', e);
            await errorResponseHelper({ res, error: e, defaultMessage: "Error in Auth" });
        }
    }
    return getAuth;
}
module.exports = getAuthToken;