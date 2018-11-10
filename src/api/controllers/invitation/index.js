/**
 * @module index
 */
'use strict';

const Invitation = require('../../models/invitation.model');

/**
 * Create invitation
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const user = req.user;
        const { email } = req.body;

        const inviteObject = await Invitation.generate(user, email);

        return res.json(inviteObject);
    } catch (error) {
        return next(error);
    }
};

