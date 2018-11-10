/**
 * @module invitation.model
 */
'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const crypto = require('crypto');
const moment = require('moment-timezone');

const APIError = require('../utils/APIError');

/**
 * Invitation Schema
 * @private
 */
const invitationSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true,
    },
    expires: {type: Date},
});

invitationSchema.statics = {

    /**
     * Get inviteObject
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async validateInvitation(token, email) {
        try {
            let tokenObject = await this.findOneAndRemove({token: token, email: email}).exec();

            if (tokenObject) {
                const {expires} = tokenObject;
                if (moment().isAfter(expires)) {
                    throw new APIError({
                        message: 'Invitation token has been expired',
                        status: httpStatus.BAD_REQUEST,
                    });
                }
                return tokenObject;
            }

            throw new APIError({
                message: 'Invitation token does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },


    /**
     * Generate an invitation and saves it into the database
     *
     * @param {User} user
     * @param {email} email
     * @returns {Invitation}
     */
    generate(user, email, organizationId) {
        const userId = user._id;
        const token = `${crypto.randomBytes(60).toString('hex')}`;
        const expires = moment().add(60, 'days').toDate();
        const tokenObject = new Invitation({
            token, userId, email, organizationId, expires,
        });
        tokenObject.save();
        return tokenObject;
    },

};

/**
 * @typedef Invitation
 */
const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;
