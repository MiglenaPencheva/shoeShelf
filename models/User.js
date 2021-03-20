const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/config');

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: ['Email is required'],
        unique: true,
        minlength: [3, 'Email should be at least 3 characters long'],
        validate: {
            validator: /^\w+([\.-_]?\w+)*@\w+([\.-]?\w+)*(\.[a-z]{2,3})+$/,
            message: 'Email should contains only english letters and/or digits'
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Password should be at least 3 characters long'],
        validate: {
            validator: /^[a-zA-Z0-9]+$/,
            message: 'Password should contains only english letters and/or digits'
        },
    },
    fullName: {
        type: String,
    },
});

userScheme.pre('save', async function (next) {
    let salt = await bcrypt.genSalt(SALT_ROUNDS);
    let hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

module.exports = mongoose.model('User', userScheme);
