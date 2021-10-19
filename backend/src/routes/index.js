const router = require('express').Router();

const auth = require('../auth');
const users = require('./users');
const events = require('./events');
const settings = require('./users');

router.use('/users', auth.isAuthenticated, users);
router.use('/events', auth.isAuthenticated, events);
module.exports = router;
