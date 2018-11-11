/**
 * @module index
 */
'use strict';

const Invitation = require('../../models/invitation.model');
const sendEmail = require('../../../config/nodemailer');

/**
 * Create invitation
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const user = req.user;
        const { email, organizationId } = req.body;

        const inviteObject = await Invitation.generate(user, email, organizationId);

        // const fullUrl = `${req.protocol}://${req.get('host')}/register/${inviteObject.token}`;
        const fullUrl = `${req.protocol}://95.213.28.116:5000/register/${inviteObject.token}`;
        // await sendEmail(email, fullUrl);
        return res.json(inviteObject);
    } catch (error) {
        return next(error);
    }
};

