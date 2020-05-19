"use strict";

const User = require('../db/models/User.js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const tokenHeaderPayload = req.cookies['token-header.payload'];
        const tokenSignature = req.cookies['token-signature'];
        const token = `${tokenHeaderPayload}.${tokenSignature}`;
        const user = await User.findOne({ _id: await jwt.verify(token, process.env.SHARED_SECRET)._id });
        if (!user) {
            throw 401;
        }
        req.user = user;
        next();
    } catch {
        res.clearCookie('token-header.payload');
        res.clearCookie('token-signature');
        res.clearCookie('pseudorandom');
        res.redirect('../');
    }
};