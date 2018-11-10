/**
 * @module express
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
// const cors = require('cors');
const helmet = require('helmet');

const routes = require('../api/routes/v1');
const error = require('../api/middlewares/error');
// const bot = require('./telegraf');
const strategies = require('./passport');
const {token} = require('../config/vars');

/**
 * Express instance
 * @public
 */
const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
// app.use(cors());

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);


app.use('/v1', routes);


// app.use(bot.webhookCallback(`/v1/bot${token}`));

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
