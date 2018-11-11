/**
 * @module organization
 * @author Pavel Fediukovich
 */

'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status');


const APIError = require('../utils/APIError');

const type = ['shelter', 'grooming', 'pet_clinic'];

/**
 * Organization Schema
 * @private
 */
const organizationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: type,
        required: true,
        default: 'shelter'
    },
    description: {
        type: String,
        trim: true,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    phone: {
        type: String,
        trim: true,
    },
    taskStats: {
        all: {
            type: Number,
        },
        active:{
            type: Number,
        },
        done:{
            type: Number,
        }
    }
});


organizationSchema.pre('save', async function save(next) {
    try {
        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Statics
 */
organizationSchema.statics = {

    type,

    /**
     * Get task
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let organization;

            if (mongoose.Types.ObjectId.isValid(id)) {
                organization = await this.findById(id).exec();
            }
            if (organization) {
                return organization;
            }

            throw new APIError({
                message: 'Organization does not exist',
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
             page = 1, perPage = 30,
         }) {

        return this.find()
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

};

organizationSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id',
            'title',
            'type',
            'description',
            'location',
            'phone',
            'taskStats'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

module.exports = mongoose.model('Organization', organizationSchema);
