const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const EventData = require('../models/event');
const {
  CREATE_EVENT_VALIDATOR,
  isValidObjectID
} = require('../util/validators');

router.post('/', CREATE_EVENT_VALIDATOR, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  const newEventData = matchedData(req);
  const newEvent = new EventData(newEventData);
  // console.log(newEvent.id);
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

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  if (!isValidObjectID(id)) {
    return res.status(400).json({ error: 'Object ID not valid' });
  }
  EventData.findOneAndDelete({ _id: id })
    .then(() => {
      res.json({
        message: 'Event successfully deleted!'
      });
    })
    .catch(next);
});

router.put('/', CREATE_EVENT_VALIDATOR, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  const updateEventData = matchedData(req);
  console.log(updateEventData);
  EventData.findOneAndUpdate({ _id: updateEventData._id }, updateEventData, {
    new: true
  })
    .then(event => {
      res.json({
        event
      });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
