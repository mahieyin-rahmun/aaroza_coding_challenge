const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

const User = require(path.resolve(__dirname, '../models/User'));

const { getJWT } = require(path.resolve(__dirname, '../utils/utils'));

const saltRounds = 10;

// ###############################################################################################################

router.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // username and password should be checked on the client side, still sanity check
    if (username && password) {         
        bcrypt.hash(password, saltRounds)
            .then(hashedPassword => {
                // create user with hashed password
                const newUser = new User({
                    username: username,
                    password: hashedPassword
                });                

                newUser.save()
                    .then(userDoc => {
                        let payload = {
                            username
                        };
                        
                        // return token
                        let token = getJWT(payload);
    
                        res.status(200).send({token});
                    })
                    .catch(err => {
                        if (err.code === 11000) {
                            return res.status(303).send("User already exists!");
                        }
                        res.status(500).send("Internal server error.");
                    });
            })
            .catch(err => {
                res.status(500).send("Internal server error.");
            }); 
    } else {
        res.status(400).send("Invalid/empty data");
    }
});


// #############################################################################################################################

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // sanity check
    if (username && password) {
        let existingUser;

        User.findOne({username: username})
            .then(doc => {
                existingUser = doc;

                if (existingUser) {
                    // compare passwords
                    bcrypt.compare(password, existingUser.password)
                        .then(result => {
                            if (result) {
                                let payload = {
                                    username
                                };

                                // return the token
                                let token = getJWT(payload);
        
                                res.status(200).send({token});
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
            })
            .catch(err => {   
                res.status(500).send("Internal server error.");
            });

    } else {
        res.status(400).send("Invalid/empty data");
    }
});

module.exports = router;