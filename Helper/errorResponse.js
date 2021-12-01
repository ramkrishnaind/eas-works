
// helper function to response error

async function errorResponse({ res, error, defaultMessage = "Error" }) {
    let err = { status: false, error: true, message: defaultMessage };
    if (error.error) err = error;

    let code = error.statusCode || 500;
    return res.status(code).send(err);
}

module.exports = errorResponse;