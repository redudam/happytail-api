/**
 * @module index
 */
'use strict';
/**
 * @module index
 */
'use strict';

const httpStatus = require('http-status');

const Property = require('../../models/property.model');

/**
 * Create new property
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const property = new Property(req.body);
        const savedProperty = await property.save();
        res.status(httpStatus.CREATED);
        res.json(savedProperty);
    } catch (e) {
        next(e);
    }
};

exports.list = async (req, res, next) => {
    try {
        const properties = await Property.list();
        res.json(properties);
    } catch (e) {
        next(e);
    }
};