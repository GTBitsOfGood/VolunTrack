const router = require('express').Router();

const auth = require('../auth');
const users = require('./users');

router.use('/users', auth.isAuthenticated, users);

module.exports = router;
