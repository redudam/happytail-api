/**
 * @module passport
 */
'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const User = require('../api/models/user.model');

const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwt = async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
};


exports.jwt = new JwtStrategy(jwtOptions, jwt);

