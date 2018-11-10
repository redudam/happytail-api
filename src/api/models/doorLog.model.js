/**
 * @module doorLog.model
 */
'use strict';

const mongoose = require('mongoose');
const {omitBy, isNil} = require('lodash');

const states = ['OPEN', 'CLOSE'];

const doorLogSchema = mongoose.Schema({
    state: {
        type: String,
        require: true,
        uppercase: true
    }
}, {
    timestamps: true
});

doorLogSchema.statics = {
    states,

    list({
             page = 1, perPage = 30, state
         }) {
        const options = omitBy({state}, isNil);

        return this.find(options)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    }
};


/**
 * @typedef DoorLog
 */
module.exports = mongoose.model('DoorLog', doorLogSchema);