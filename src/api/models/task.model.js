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
const status = ['available', 'in_progress', 'hidden', 'done', 'deleted', 'assigned'];

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
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
        },
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
    organization: {
        type: Object,
        ref : 'organization',
    },
    date: {
        type: Date,
    },
    duration:{
        type: Number,
    },
    hasManyAssignee:{
        type: Boolean
    },


}, {
    timestamps: true,
});

/**
 * Methods
 */
taskSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'title', 'location', 'type', 'priority', 'status', 'ownerId',
            'updatedAt', 'createdAt', 'date', 'duration', 'hasManyAssignee', 'organization'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

taskSchema.pre('save', async function save(next) {
    try {
        const task = this;
        if (!task.location.type && !task.location.coordinates.length) {
            task.location= undefined;
        }

        return next();
    } catch (error) {
        return next(error);
    }
});

taskSchema.index({ title: "text" });
taskSchema.index({ location: "2dsphere" });

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
    },

    /**
     * List tasks in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of tasks to be skipped.
     * @param {number} limit - Limit number of tasks to be returned.
     * @returns {Promise<Task[]>}
     */
    list({
             page = 1, perPage = 30, title, priority
         }) {

        const textSearch = title ? {$text: {$search: title}} : {};


        const statusFilter = {status:{
                $nin: [ 'hidden', 'deleted']
            }};

        const filters = [textSearch, statusFilter];
        if (priority) {
            filters.push({priority: {$in: priority}});
        }
        return this.find().and(filters)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

};

/**
 * @typedef Task
 */
module.exports = mongoose.model('Task', taskSchema);
