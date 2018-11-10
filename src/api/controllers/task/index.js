/**
 * @module index
 * @author Pavel Fediukovich
 */

'use strict';

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Task = require('../../models/task.model');
const { handler: errorHandler } = require('../../middlewares/error');

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const task = new Task(req.body);
        const savedUser = await user.save();
        res.status(httpStatus.CREATED);
        res.json(savedUser.transform());
    } catch (error) {
        next(User.checkDuplicateEmail(error));
    }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
        const { user } = req.locals;
        const newUser = new User(req.body);
        const ommitRole = user.role !== 'admin' ? 'role' : '';
        const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

        await user.update(newUserObject, { override: true, upsert: true });
        const savedUser = await User.findById(user._id);

        res.json(savedUser.transform());
    } catch (error) {
        next(User.checkDuplicateEmail(error));
    }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
    const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
    const updatedUser = omit(req.body, ommitRole);
    const user = Object.assign(req.locals.user, updatedUser);

    user.save()
        .then(savedUser => res.json(savedUser.transform()))
        .catch(e => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const users = await User.list(req.query);
        const transformedUsers = users.map(user => user.transform());
        res.json(transformedUsers);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
    const { user } = req.locals;

    user.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch(e => next(e));
};
