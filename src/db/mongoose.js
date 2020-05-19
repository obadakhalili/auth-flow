"use strict";

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, err => {
    if (err) {
        console.log('Couldn\'t connect to database');
        process.exit(1);
    } else {
        console.log('Connected to database');
        require('../app.js');
    }
});