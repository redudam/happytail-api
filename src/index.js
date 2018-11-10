/**
 * @module index
 */
'use strict';
Promise = require('bluebird');

const app = require('./config/express');
const {port} = require('./config/vars');
const mongoose = require('./config/mongoose');

mongoose.connect();

app.listen(port, () => console.info(`Server has been started on ${port} port`));
/**
 * Exports express
 * @public
 */
module.exports = app;