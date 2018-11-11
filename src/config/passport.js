/**
 * @module passport
 */
'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const authProviders = require('../api/services/authProviders');
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

const oAuth = service => async ({token, user_id}, done) => {
    try {
        const userData = await authProviders[service](token, user_id);
        const user = await User.oAuthLogin(userData);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);

