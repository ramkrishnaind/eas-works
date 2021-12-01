
// helper function to create unique token for the verifying user(on signup, or forget password)
const crypto = require('crypto');
const { nanoid } = require('nanoid');

function createToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, function(err, buffer)  {
            resolve(buffer.toString('base64'));
        })
    })
}

module.exports = async function createHash(data) {
    let hash;
    hash = nanoid(30);
    // hash = await createToken();
    return hash;
}