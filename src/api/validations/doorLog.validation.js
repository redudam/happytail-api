/**
 * @module doorLog.validation
 */
'use strict';
const Joi = require('joi');
const DoorLog = require('../models/doorLog.model');

module.exports = {
    // GET /v1/doorLog
    listDoorLogs: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            state: Joi.string().valid(DoorLog.states)
        }
    },

    // POST /v1/doorLog
    createDoorLog: {
        body: {
            state: Joi.string().valid(DoorLog.states)
        }
    }
};