const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

async function register(email, password) {
    let existing = await User.findOne({ email });
    if (existing) throw { message: 'Email already exists' };

    let user = new User({ email, password });
    return user.save();
}

async function login(email, password) {
    let user = await User.findOne({ email });
    if (!user) throw { message: 'Email not found', status: 404 };

    let areEqual = await bcrypt.compare(password, user.password);
    if (!areEqual) throw { message: 'Wrong email or password', status: 404 };

    let token = jwt.sign({ _id: user._id, email: user.email }, SECRET);

    return token;
}

module.exports = {
    register,
    login,
};