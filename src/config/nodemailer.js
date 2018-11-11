/**
 * @module nodemailer
 * @author Pavel Fediukovich
 */

'use strict';

const nodemailer = require('nodemailer');

const {user, password} = require('./vars');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: password
    }
});

const sendEmail = (email, content) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: user,
            to: email,
            subject: 'Access to Happy Tail',
            text: content
        }, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    })
};

module.exports = sendEmail;
