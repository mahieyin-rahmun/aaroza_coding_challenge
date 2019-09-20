const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true
    },
    birthday: {
        type: mongoose.Schema.Types.Date
    },
    country: {
        type: mongoose.Schema.Types.String
    }
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;