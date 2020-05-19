"use strict";

const {
    login,
    logout,
    signup,
    update,
    accounts
} = require('../controllers/users.js');
const authenticate = require('../middlewares/authenticate.js');
const authorize = require('../middlewares/authorize.js');
const { Router } = require('express');

const router = new Router();

router.post('/login', login);
router.get('/logout', logout);

router.route('/')
    .post(signup)
    .patch(authenticate, update)
    .get(authenticate, authorize, accounts);
    
module.exports = router;