/**
 * @module user.route
 */
'use strict';
const express = require('express');
const controller = require('../../controllers/organization');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('organizationId', controller.load);

router
    .route('/')
    .get(controller.list)
    .post(authorize(ADMIN), controller.create);


router
    .route('/:organizationId')
    .get(controller.get)
    .put(authorize(ADMIN), controller.replace)
    .patch(authorize(ADMIN), controller.update)
    .delete(authorize(ADMIN), controller.remove);

router
    .route('/:organizationId/members')
    .get(controller.getMembers);


module.exports = router;
