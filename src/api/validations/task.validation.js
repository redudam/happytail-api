/**
 * @module task.validation
 */
'use strict';

const Joi = require('joi');
const Task = require('../models/task.model');

module.exports = {

    // GET /v1/tasks
    listTasks: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            title: Joi.string(),
        },
    },

    // POST /v1/tasks
    createTask: {
        body: {
            title: Joi.string().required(),
            description: Joi.string().required(),
            location : Joi.object().keys({
                type: Joi.string().valid('Point'),
                coordinates: Joi.array().items(Joi.number()).min(2).max(2)
            }),
            status : Joi.string().valid(Task.status),
            priority : Joi.string().valid(Task.priority),
            type : Joi.string().valid(Task.type),
            date : Joi.date(),
            duration : Joi.number().min(1),
        },
    },

    // PUT /v1/tasks/:taskId
    replaceTask: {
        body: {
            title: Joi.string().required(),
            description: Joi.string().required(),
            location : Joi.object().keys({
                type: Joi.string().valid('Point'),
                coordinates: Joi.array().items(Joi.number()).min(2).max(2)
            }),
            status : Joi.string().valid(Task.status),
            priority : Joi.string().valid(Task.priority),
            type : Joi.string().valid(Task.type),
            date : Joi.date().required(),
            duration : Joi.number().min(1).required(),
        },
        params: {
            taskId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        },
    },

    // PATCH /v1/tasks/:taskId
    updateTask: {
        body: {
            title: Joi.string().required(),
            description: Joi.string().required(),
            location : Joi.object().keys({
                type: Joi.string().valid('Point'),
                coordinates: Joi.array().items(Joi.number()).min(2).max(2)
            }),
            status : Joi.string().valid(Task.status),
            priority : Joi.string().valid(Task.priority),
            type : Joi.string().valid(Task.type),
            date : Joi.date().required(),
            duration : Joi.number().min(1).required(),
        },
        params: {
            taskId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        },
    },
};
