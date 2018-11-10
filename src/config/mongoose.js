/**
 * @module mongoose
 */
'use strict';

const mongoose = require('mongoose');
const {mongo, env} = require('./vars');

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

mongoose.connection.on('connected', () => {
    console.debug('connected');
});
mongoose.connection.on('disconnected', () => {
    console.debug('disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
    mongoose.connect(mongo.uri, {
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        keepAlive: 1,
    });
    return mongoose.connection;
};
