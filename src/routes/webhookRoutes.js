const express = require("express");
const {
  subscribeWebhook,
  getWebhooks,
  getWebhookById,
  cancelWebhook
} = require("../controllers/webhookController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/subscribe", protect, subscribeWebhook);
router.get("/", protect, getWebhooks);
router.get("/:id", protect, getWebhookById);
router.delete("/:id", protect, cancelWebhook);

module.exports = router;