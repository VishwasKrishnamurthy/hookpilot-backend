const mongoose = require("mongoose");
const crypto = require("crypto");

const webhookSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    callbackUrl: { type: String, required: true },
    eventTypes: [{ type: String }],
    secret: {
      type: String,
      default: () => crypto.randomBytes(24).toString("hex")
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebhookSubscription", webhookSubscriptionSchema);