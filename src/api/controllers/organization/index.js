/**
 * @module index.js
 * @author Pavel Fediukovich
 */

'use strict';

const httpStatus = require('http-status');
const Organization = require('../../models/organization.model');
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
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const organization = new Organization(req.body);
        await organization.save();
        res.status(httpStatus.CREATED);
        res.json(organization);
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

        await organization.update(newOrganization, { override: true, upsert: true });
        const savedOrganization = await Organization.findById(organization._id);

        res.json(savedOrganization);
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


    const updatedOrganization = req.body;
    Object.assign(organization, updatedOrganization);

    organization.save()
        .then(res.json)
        .catch(next);
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const organizations = await Organization.list(req.query);
        res.json(organizations);
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
