"use strict";

const usersRouter = require('./routes/users.js');
const auth = require('./middlewares/authenticate.js');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const sessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SHARED_SECRET
};
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());
app.use('/users', usersRouter);

app.get(/^\/(login)?$/, (req, res, next) => {
    if (req.cookies['token-signature']) {
        res.redirect('../dashboard');
    } else {
        next();
    }
}, (req, res) => res.render('login', { errors: req.flash('errors') }));
app.get('/register', (req, res, next) => {
    if (req.cookies['token-signature']) {
        res.redirect('../dashboard');
    } else {
        next();
    }
}, (req, res) => res.render('register', { errors: req.flash('errors') }));
app.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', {
        username: req.user.username,
        users: req.flash('users')
    })
});

app.listen(port, console.log('App is running on port ' + port));