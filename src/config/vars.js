/**
 * @module vars
 */
'use strict';
const path = require('path');

// import .env variables
require('dotenv-safe').load({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
});


module.exports = {
    url: process.env.URL,
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    token: process.env.BOT_TOKEN,
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/alarm'
    }
};