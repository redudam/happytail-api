/**
 * @module taskAction.router
 * @author Pavel Fediukovich
 */

'use strict';

const express = require('express');
const controller = require('../../../controllers/task/index');
const { authorize, USER, ORGANIZATION } = require('../../../middlewares/auth');

const router = express.Router({mergeParams: true});

router.post('/', authorize([USER, ORGANIZATION]), controller.finish)

module.exports = router;
;
