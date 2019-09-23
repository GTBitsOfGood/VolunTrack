const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const mongoose = require('mongoose');
const { SendEmailError, EmailInUseError } = require('../util/errors');
const eventData = require('../models/event');
const { USER_DATA_VALIDATOR } = require('../util/validators');
const DEFAULT_PAGE_SIZE = 10;

router.post('/events', (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
    }
    const newEventData = matchedData(req);
    let event = null;
    eventData.findOne({ 'name': newEventData.name })
        .then(user => {
            if (user) {
                throw new EmailInUseError(
                    `Event ${newEventData.name} already created by ${newEventData.contact}`,
                    newEventData.name, newEventData.contact
                );
            }
            return Promise.resolve();
        })
        .then(() => {
            const newEvent = new eventData(newEventData);
            return newEvent.save();
        })
        .then((savedEventData) => {
            event = savedEventData
        })
        .then(() => {
            res.status(200).json({ event })
        })
        .catch(err => {
            if (err instanceof EmailInUseError) {
                return res.status(400).json({
                    error: err.message,
                    errorType: err.name
                });
            }
            return next(err);
        });

});

router.get('/events', (req, res, next) => {
    eventData.find({}, (err, event) => {
        if (err) console.log(err);
        else res.send(event);
    })
});