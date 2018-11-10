/**
 * @module index
 */
'use strict';

const httpStatus = require('http-status');

const DoorLog = require('../../models/doorLog.model');
const bot = require('../../../config/telegraf');
const User = require('../../models/user.model');
const Property = require('../../models/property.model');

/**
 * Create new door log
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const doorLog = new DoorLog(req.body);
        const savedDoorLog = await doorLog.save();

        const alarmEnabled = await Property.get('ALARM_ENABLED');
        if (alarmEnabled && alarmEnabled.value === 'true')
        {
            const users = await User.list({notifications: {telegram: true}});
            users.forEach(async (user) => {
                try {
                    await bot.telegram.sendMessage(user.telegramId, `Door is ${savedDoorLog.state}`);
                } catch (e) {
                    console.log(`${e.message}: ${user.telegramId}`);
                }
            });
        }

        res.status(httpStatus.CREATED);
        res.json(savedDoorLog);
    } catch (e) {
        next(e);
    }
};

exports.list = async (req, res, next) => {
    try {
        const doorLogs = await DoorLog.list(req.query);
        res.json(doorLogs);
    } catch (e) {
        next(e);
    }
};