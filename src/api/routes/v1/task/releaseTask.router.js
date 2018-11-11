/**
 * @module taskAction.router
 * @author Pavel Fediukovich
 */

'use strict';

const express = require('express');
const controller = require('../../../controllers/task/index');
const { authorize, USER } = require('../../../middlewares/auth');

const router = express.Router({mergeParams: true});

router.post('/', authorize(USER), controller.release);

module.exports = router;
