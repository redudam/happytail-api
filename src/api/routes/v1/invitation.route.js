/**
 * @module invitation.route
 */
'use strict';
const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/invitation');

const {authorize, ADMIN, ORGANIZATION} = require('../../middlewares/auth');
const {createInvitation} = require('../../validations/invitation.validation');

const router = express.Router();

router
    .route('/')
    /**
     * @api {post} v1/invitations User Profile
     * @apiDescription Invite a user
     * @apiVersion 1.0.0
     * @apiName InviteUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiParam  {String}  email         User's email
     *
     * @apiSuccess {String}  inviteToken   Authorization Token
     * @apiSuccess {String}  email         Email of invited user
     * @apiSuccess {Number}  expiresIn     Invite Token's expiration time in miliseconds
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can invite user
     */
    .post(authorize([ADMIN, ORGANIZATION]), validate(createInvitation), controller.create);

module.exports = router;
