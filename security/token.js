const crypto = require('crypto');

function CreateToken(digitCount) {
    return crypto.randomBytes(digitCount).toString('hex');
}

module.exports = CreateToken;