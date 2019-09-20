const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;