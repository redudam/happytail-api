/**
 * @module index
 * @author Pavel Fediukovich
 */

'use strict';

const httpStatus = require('http-status');
const { omit } = require('lodash');
const reject = require('lodash/reject');
const Task = require('../../models/task.model');
const User = require('../../models/user.model');
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
        const { task, user } = req.locals;

        if (task.ownerId !== user._id){
            const err = new Error();
            err.stack= httpStatus.FORBIDDEN;
            throw err;
        }
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
    const { task, user } = req.locals;

    if (task.ownerId !== user._id){
        const err = new Error();
        err.stack = httpStatus.FORBIDDEN;
        throw err;
    }

    const updatedTask = req.body;
    Object.assign(task, updatedTask);

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

exports.take = async (req, res, next) =>{
    const { task, user } = req.locals;
    if (task.status !== 'available') {
        const err = new Error('Task is not available');
        err.stack= httpStatus.BAD_REQUEST;
        throw err;
    }
    try {
        if (!task.hasManyAssignee) {
            task.status = 'assigned';
            await task.save();
        }
        user.tasks.push(task);
        await user.save();
    } catch (e) {
        next(e);
    }
};

exports.release = async (req, res, next) =>{
    const { task, user } = req.locals;
    if (task.status !== 'assigned' && !task.hasManyAssignee) {
        const err = new Error('Task is not assigned');
        err.stack= httpStatus.BAD_REQUEST;
        throw err;
    }
    try {
        task.status = 'available';
        await task.save();
        user.tasks = reject(user.tasks, item => item._id === task._id);
        await user.save();
    } catch (e) {
        next(e);
    }
};

exports.done = async (req, res, next) =>{
    const { task, user } = req.locals;
    if (task.status !== 'assigned' && !task.hasManyAssignee) {
        const err = new Error('Task is not assigned');
        err.stack= httpStatus.BAD_REQUEST;
        throw err;
    }
    try {
        if (!task.hasManyAssignee) {
            task.status = 'done';
            await task.save();
        }
        const userTask = user.tasks.find(item => item._id === task._id);
        userTask.status = 'done';
        await user.save();
    } catch (e) {
        next(e);
    }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
    const { task, user } = req.locals;

    if (task.ownerId !== user._id){
        const err = new Error();
        err.stack = httpStatus.FORBIDDEN;
        throw err;
    }


    task.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch(e => next(e));
};
