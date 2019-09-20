const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require(path.resolve(__dirname, '../models/User'));
const Movie = require(path.resolve(__dirname, '../models/Movie'));
const { getJWToptions } = require(path.resolve(__dirname, '../utils/utils'));

// ###############################################################################################################

const checkToken = (req, res, next) => {
    let authorizationHeader = req.header('Authorization');

    if (authorizationHeader) {
        // Authorization: Bearer <token>
        let token = authorizationHeader.split(" ")[1];    

        jwt.verify(token, process.env.SECRET_KEY, getJWToptions(), (err, decodedInfo) => {
            if (err) {
                // token isn't valid
                return res.status(403).send(err.message);
            }

            let username = decodedInfo.username;    

            User.findOne({username: username})
                .then(doc => {
                    if (doc) {
                        // user exists in the database                    
                        next();
                    } else {
                        return res.status(403).send(err.message);
                    }
                })
                .catch(err => {
                    return res.status(500).send("Internal server error");
                });
        });
    } else {
        return res.status(403).send("Authorization header must be provided.");
    }    
};

// ###############################################################################################################

router.get('/', checkToken, (req, res) => {
    Movie.find()
        .then(docs => res.json(docs))
        .catch(err => res.status(500).send("Internal server error"));
});


module.exports = router;