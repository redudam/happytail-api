/**
 * @module property.route
 */
'use strict';

const express = require('express');

const controller = require('../../controllers/property');

const router = express.Router();

router.route('/')
    .post(controller.create)
    .get(controller.list);

module.exports = router;