const express = require('express');
const router = express.Router();
const path = require('path');

const Actor = require(path.resolve(__dirname, '../models/Actor'));

// unprotected route
router.get('/', (req, res) => {
    Actor.find()
        .then(actorsObj => res.json(actorsObj))
        .catch(err => res.status(500).send("Internal server error."));
});

module.exports = router;