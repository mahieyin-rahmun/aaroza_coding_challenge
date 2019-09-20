const jwt = require('jsonwebtoken');

// helper function that keeps track of the jwt options
const getJWToptions = () => {
    let options = {
        "expiresIn": "2h",
        "issuer": "aaroza"
    };

    return options;
};


// helper function that returns jwt, given payload
const getJWT = (payload) => {
    options = getJWToptions();

    let token = jwt.sign(payload, process.env.SECRET_KEY, options);

    return token;
};

module.exports = {
    getJWToptions,
    getJWT
}