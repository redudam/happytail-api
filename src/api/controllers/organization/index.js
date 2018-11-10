/**
 * @module index.js
 * @author Pavel Fediukovich
 */

'use strict';

const httpStatus = require('http-status');
const Organization = require('../../models/organization.model');
const User = require('../../models/user.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../../middlewares/error');


/**
 * Load task and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const organization = await Organization.get(id);
        req.locals = { organization };
        return next();
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


/**
 * Load user and append to req.
 * @public
 */
exports.get = (req, res) => res.json(req.locals.organization.transform());
/**
 * Load user and append to req.
 * @public
 */
exports.getMembers = async (req, res, next) => {
    const { organization } = req.locals;
    try {
        const members = await User.findAll({organization});

        res.json(members.map(member => member.transform()));
    } catch (e) {
        next();
    }
};

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const organization = new Organization(req.body);
        const created = await organization.save();
        res.status(httpStatus.CREATED);
        res.json(created.transform());
    } catch (error) {
        next(error);
    }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
        const { organization } = req.locals;

        const newOrganization = new Organization(req.body);
        const newOrganizationObject = omit(newOrganization.toObject(), '_id');

        await organization.update(newOrganizationObject, { override: true, upsert: true });
        const savedOrganization = await Organization.get(organization._id);

        res.json(savedOrganization.transform());
    } catch (error) {
        next(error);
    }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
    const { organization } = req.locals;

    Object.assign(organization, req.body);

    organization.save()
        .then(saved => res.json(saved.transform()))
        .catch(err =>{
            next(err);
        });
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const organizations = await Organization.list(req.query);
        res.json(organizations.map(org=>org.transform()));
    } catch (error) {
        next(error);
    }
};


/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
    const { organization } = req.locals;

    organization.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch(e => next(e));
};
