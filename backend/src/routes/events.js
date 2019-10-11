const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const EventData = require('../models/event');
const { EVENT_VALIDATOR } = require('../util/validators');

router.post('/', EVENT_VALIDATOR, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  const newEventData = matchedData(req);
  const newEvent = new EventData(newEventData);
  newEvent
    .save()
    .then(() => {
      res.json({
        message: 'Event successfully created!'
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/', (req, res, next) => {
  EventData.find({})
    .then(events => {
      res.status(200).json({
        events
      });
    })
    .catch(next);
});
// add search route with filter parms

module.exports = router;
