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
 * Load task and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const task = await Task.get(id);
        req.locals = { task };
        return next();
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


/**
 * Load user and append to req.
 * @public
 */
exports.get = (req, res) => res.json(req.locals.task.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const loggedUserId = req.user._id;
        let task = new Task(req.body);
        task.ownerId = loggedUserId;
        task = await task.save();
        res.status(httpStatus.CREATED);
        res.json(task.transform());
    } catch (error) {
        next(error);
    }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
        const { task } = req.locals;
        const newTask = new Task(req.body);

        await task.update(newTask, { override: true, upsert: true });
        const savedTask = await Task.findById(task._id);

        res.json(savedTask.transform());
    } catch (error) {
        next(error);
    }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
    const updatedTask = req.body;
    const task = Object.assign(req.locals.task, updatedTask);

    task.save()
        .then(savedTask => res.json(savedTask.transform()))
        .catch(next);
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const tasks = await Task.list(req.query);
        const transformedTasks = tasks.map(task => task.transform());
        res.json(transformedTasks);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
    const { task } = req.locals;

    task.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch(e => next(e));
};
