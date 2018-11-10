/**
 * @module door.route
 */
'use strict';

const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/doorLog');
const {listDoorLogs, createDoorLog} = require('../../validations/doorLog.validation');

const router = express.Router();

router.route('/')
    .post(validate(createDoorLog), controller.create)
    .get(validate(listDoorLogs), controller.list);

module.exports = router;