/**
 * @module members.route
 * @author Pavel Fediukovich
 */

'use strict';

const express = require('express');
const controller = require('../../controllers/organization');
const router = express.Router({mergeParams: true});

router.get('/',controller.getMembers);

module.exports = router;
