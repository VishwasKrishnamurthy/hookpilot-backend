const express = require("express");
const {
  receiveWebhookEvent,
  getEvents,
  getEventById
} = require("../controllers/eventController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:subscriptionId", receiveWebhookEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);

module.exports = router;