const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebhookSubscription",
      required: true
    },
    eventType: { type: String, required: true },
    payload: { type: Object, required: true },
    status: {
      type: String,
      enum: ["received", "processing", "processed", "failed"],
      default: "received"
    },
    retryCount: { type: Number, default: 0 },
    errorMessage: { type: String },
    receivedAt: { type: Date, default: Date.now },
    processedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebhookEvent", webhookEventSchema);