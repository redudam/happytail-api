/**
 * @module user.model
 */
'use strict';
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

const APIError = require('../utils/APIError');
const {env, jwtSecret, jwtExpirationInterval} = require('../../config/vars');

/**
 * User Roles
 */
const roles = ['user', 'admin', 'organization'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    organization: {
        type: Object,
        ref: 'organization',
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    telegramId: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    firstName: {
        type: String,
        maxlength: 128,
        trim: true,
    },
    lastName: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
    picture: {
        type: String,
        trim: true,
    },
    notifications: {
        telegram: {
            type: Boolean,
        }
    },
    phone: {
        type: String,
        trim: true,
    },
    tasks: {
        type: Array,
        default: []
    },
    taskStats: {
        all: {
            type: Number,
        },
        undone: {
            type: Number,
        },
        done: {
            type: Number,
        }
    },
    services: {
        vk: String,
    },
}, {
    timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
    try {
        const {tasks} = this;
        if (!this.isModified('password')) {

            if (tasks) {
                tasks.forEach(task => {
                    if (task.status === 'assigned') {
                        this.taskStats.undone += 1;
                    } else if (task.status === 'done') {
                        this.taskStats.done += 1;
                    }
                });
            }

            this.taskStats.all = tasks.lenght || 0;

            return next();
        }

        const rounds = env === 'test' ? 1 : 10;

        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Methods
 */
userSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id',
            'firstName',
            'lastName',
            'picture',
            'role',
            'createdAt',
            'updatedAt',
            'email',
            'organization',
            'phone',
            'tasks',
            'taskStats'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    token() {
        const payload = {
            exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this._id,
        };
        return jwt.encode(payload, jwtSecret);
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    },
});

/**
 * Statics
 */
userSchema.statics = {

    roles,

    /**
     * Find user by telegramId
     *
     * @param {String} telegramId - The telegramId of user.
     * @returns {Promise<User, APIError>}
     */
    async findByTelegramId(telegramId) {
        try {

            const user = await this.findOne({telegramId: telegramId}).exec();
            if (user) {
                return user;
            }

            throw new APIError({
                message: 'User does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError({
                message: 'User does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const {email, password, refreshObject} = options;
        if (!email) throw new APIError({message: 'An email is required to generate a token'});

        const user = await this.findOne({email}).exec();
        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
        };
        if (password) {
            if (user && await user.passwordMatches(password)) {
                return {user, accessToken: user.token()};
            }
            err.message = 'Incorrect email or password';
        } else if (refreshObject && refreshObject.userEmail === email) {
            return {user, accessToken: user.token()};
        } else {
            err.message = 'Incorrect email or refreshToken';
        }
        throw new APIError(err);
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({
             page = 1, perPage = 30, firstName, email, role, organizationId
         }) {
        const options = omitBy({firstName, email, role, organizationId}, isNil);

        return this.find(options)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return new APIError({
                message: 'Validation Error',
                errors: [{
                    field: 'email',
                    location: 'body',
                    messages: ['"email" already exists'],
                }],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    },

    async oAuthLogin({
                         service, user_id, last_name, first_name,
                     }) {
        const user = await this.findOne({$or: [{[`services.${service}`]: user_id}, {email}]});
        if (user) {
            user.services[service] = user_id;
            if (!user.last_name) user.lastName = last_name;
            if (!user.first_name) user.firstName = first_name;
            return user.save();
        }
        const password = uuidv4();
        return this.create({
            services: {[service]: user_id}, password, lastName: last_name, firstName: first_name,
        });
    },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
