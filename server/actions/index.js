const router = require("express").Router();

const auth = require("../auth");
const users = require("./users");
const events = require("./events");
const waivers = require("./waivers");

router.use("/users", auth.isAuthenticated, users);
router.use("/events", auth.isAuthenticated, events);
router.post("/api/waivers", upload.single('test'), auth.isAuthenticated, waivers);
module.exports = router;
