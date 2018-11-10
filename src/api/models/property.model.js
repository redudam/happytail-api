/**
 * @module property.model
 */
'use strict';

const mongoose = require('mongoose');

const APIError = require('../utils/APIError');

const names = {TELEGRAM_TOKEN: 'TELEGRAM_TOKEN'};

const propertySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    value: {
        type: String,
        require: true
    }
});

propertySchema.statics = {
    names,

    async get(name) {
        try {
            const property = await this.findOne({name: name}).exec();
            if (property) {
                return property;
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    list() {
        return this.find({}).exec();
    }
};

/**
 * @typedef Property
 */
module.exports = mongoose.model('Property', propertySchema);