/**
 * @module task.model
 */
'use strict';
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const moment = require('moment-timezone');


const APIError = require('../utils/APIError');

/**
 * Task Status
 */
const status = ['available', 'in_progress', 'hidden', 'done', 'deleted'];

/**
 * Task Priority
 */
const priority = ['low', 'medium', 'high', 'hot', 'extra'];

/**
 * Task type
 */
const type = ['auto', 'animals', 'remote', 'donate', 'other'];

/**
 * Model Schema
 * @private
 */
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    status: {
        type: String,
        enum: status,
        default: 'available',
        required: true,
    },
    priority: {
        type: String,
        enum: priority,
        default: 'medium',
        required: true,
    },
    type: {
        type: String,
        enum: type,
        default: 'other',
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required: true,
    },
    date: {
        type: Date,
    },
    duration:{
        type: Number,
    }
}, {
    timestamps: true,
});

/**
 * Methods
 */
taskSchema.method({
    transform() {
        const transformed = {};
        const fields = ['name', 'latitude', 'longitude', 'type', 'priority', 'status', 'ownerId',
            'updatedAt', 'createdAt', 'date', 'duration'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

/**
 * Statics
 */
taskSchema.statics = {

    priority,
    status,
    type,

    /**
     * Get task
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let task;

            if (mongoose.Types.ObjectId.isValid(id)) {
                task = await this.findById(id).exec();
            }
            if (task) {
                return task;
            }

            throw new APIError({
                message: 'Task does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    }
};

/**
 * @typedef Task
 */
module.exports = mongoose.model('Task', taskSchema);
