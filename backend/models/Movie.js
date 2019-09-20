const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.String,
        unique: true
    },
    year: {
        type: mongoose.Schema.Types.String
    },
    rating: {
        type: mongoose.Schema.Types.String
    },
    actors: mongoose.Schema.Types.Array
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;