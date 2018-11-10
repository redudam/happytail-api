/**
 * @module bot.route
 */
'use strict';

const express = require('express');

const controller = require('../../controllers/bot');

const router = express.Router();

router.route('/')
    .post(controller.handle);

module.exports = router;