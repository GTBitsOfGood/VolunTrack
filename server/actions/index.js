const router = require("express").Router();

const auth = require("../auth");
const users = require("./users");
const events = require("./events");

router.use("/users", auth.isAuthenticated, users);
router.use("/events", auth.isAuthenticated, events);
module.exports = router;
