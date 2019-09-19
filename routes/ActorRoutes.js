const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // TODO: replace by mongodb
    let actorsObj = [
        {
            "name": "Robert Downey, Jr.",
            "birthday": new Date("April 4, 1965"),
            "country": "United States"
        },
        {
            "name": "Will Smith",
            "birthday": new Date("September 25, 1968"),
            "country": "United States"
        },
        {
            "name": "Johnny Depp",
            "birthday": new Date("June 9, 1963"),
            "country": "United States"
        }
    ];

    res.json(actorsObj);
});

module.exports = router;