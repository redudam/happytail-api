/**
 * @module invitation.validation
 */
'use strict';

const Joi = require('joi');

module.exports = {
    // POST /v1/invitations/
    createInvitation: {
        body: {
            email: Joi.string().email().required(),
        }
    }
};
