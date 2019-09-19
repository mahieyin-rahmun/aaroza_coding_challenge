const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// TODO: replace by mongodb
let users = [];

const saltRounds = 10;

router.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let userExists = false;

    if (username && password) {
        users.forEach(user => {
            if (user.username === username)
                userExists = true;
        });
    
        if (!userExists) {        
            bcrypt.hash(password, saltRounds)
                .then(hashedPassword => {
                    users.push({
                        "username": username,
                        "password": hashedPassword
                    });
                    
                    let payload = {
                        username
                    };
                    let token = getJWT(payload);

                    res.status(200).send(token);
                })
                .catch(err => {
                    res.status(500).send("Internal server error.");
                })
        } else {
            res.status(303).send("User already exists!");
        }    
    } else {
        res.status(400).send("Invalid/empty data");
    }

    console.log(users);
});


// #############################################################################################################################

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        let existingUser;

        users.forEach(user => {
            if (user.username === username)
                existingUser = user;
        });

        if (existingUser) {
            bcrypt.compare(password, existingUser.password)
                .then(result => {
                    if (result) {
                        let payload = {
                            username
                        };
                        let token = getJWT(payload);

                        res.status(200).send(token);
                    } else {
                        res.status(403).send("Invalid credentials.");
                    }
                })
                .catch(err => {
                    res.status(500).send("Internal server error.");
                })
        } else {
            res.status(403).send("Invalid credentials.");
        }

    } else {
        res.status(400).send("Invalid/empty data");
    }
});


const getJWT = (payload) => {
    let options = {
        "expiresIn": "2h",
        "issuer": "aaroza"
    };

    let token = jwt.sign(payload, process.env.SECRET_KEY, options);

    return token;
}

module.exports = router;