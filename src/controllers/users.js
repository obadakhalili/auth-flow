"use strict";

const User = require('../db/models/User.js');

exports.login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body);
        const [header, payload, signature] = (await user.generateAuthToken()).split('.');
        res.cookie('token-signature', signature, {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV == 'production' ? true : false
        });
        res.cookie('token-header.payload', `${header}.${payload}`, {
            sameSite: true,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            maxAge: 1000 * 60 * 30
        });
        res.cookie('pseudorandom', Math.floor(Math.random() * 1000000), {
            sameSite: true,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            maxAge: 1000 * 60 * 30
        });
        res.redirect('../dashboard');
    } catch {
        req.flash('errors', 'Bad Credentials.');
        res.redirect('../');
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('token-header.payload');
    res.clearCookie('token-signature');
    res.clearCookie('pseudorandom');
    res.redirect('../');
};

exports.signup = async (req, res) => {
    try {
        req.body.admin = req.body.admin ? true : undefined;
        const user = await new User(req.body).save();
        const [header, payload, signature] = (await user.generateAuthToken()).split('.');
        res.redirect('../');
    } catch (e) {
        const errors = [];
        if (e.code == 11000) {
            errors.push('Username already exists. Use different Username.');
        } else {
            for (let error in e.errors) {
                errors.push(e.errors[error].message);
            }
        }
        req.flash('errors', errors);
        res.redirect('../register');
    }
};

exports.update = async (req, res) => {
    try {
        for (let update in req.body) {
            if (['username', 'password'].includes(update)) {
                req.user[update] = req.body[update];
            }
        }
        await req.user.save();
        res.end();
    } catch (e) {
        const errors = [];
        if (e.code == 11000) {
            errors.push('Username already exists. Use different Username.');
        } else {
            for (let error in e.errors) {
                errors.push(e.errors[error].message);
            }
        }
        res.status(400).json({ errors });
    }
};

exports.accounts = async (req, res) => {
    const users = await User.find({}, { _id: false, password: false, __v: false });
    req.flash('users', users);
    console.log(users);
    res.redirect('../dashboard');
};