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

router.delete('/', EVENT_VALIDATOR, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
    }
    let event = new EventData(matchedData(req));
    EventData.findOneAndDelete(
        {name : event.name}
    ).then(()=>
        console.log
    );
});

router.put('/', EVENT_VALIDATOR, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
    }
    const updateEventData = matchedData(req);
    const editEvent = new EventData(updateEventData);
    EventData.findOneAndUpdate(
        {name : editEvent.name},
        updateEventData,
        {new : true},
    ).then(()=>
        console.log
    );
});

module.exports = router;
