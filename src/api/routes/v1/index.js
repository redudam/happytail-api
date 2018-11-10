/**
 * @module index
 */
'use strict';

const express = require('express');

// const doorLogRoutes = require('./doorLog.route');
const userRoutes = require('./user.route');
const invitationRoutes = require('./invitation.route');
const authRoutes = require('./auth.route');
const propertyRoutes = require('./property.route');
const taskRoutes = require('./task.route');
// const botRoutes = require('./bot.route');

const {token} = require('../../../config/vars');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/invitations', invitationRoutes);
router.use('/auth', authRoutes);
// router.use('/doorLog', doorLogRoutes);
router.use('/properties', propertyRoutes);
router.use('/tasks', taskRoutes);
// router.use(`/bot${token}`, botRoutes);

module.exports = router;
