"use strict";

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: [2, 'Username too short. Should be 7 characters or more'],
        maxlength: [25, 'Username too long. Should be 25 characters or less']
    },
    password: {
        type: String,
        required: true,
        minlength: [7, 'Password too short. Should be 7 characters or more'],
        maxlength: [100, 'Password too long. Should be 72 characters or less']
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.statics.findByCredentials = async function({ username, password }) {
    const user = await User.findOne({ username });
    if (!user || !await argon2.verify(user.password, password)) {
        throw 401;
    }
    return user;
};

userSchema.methods.generateAuthToken = async function() {
    return await jwt.sign({ _id: this._id }, process.env.SHARED_SECRET);
};

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;