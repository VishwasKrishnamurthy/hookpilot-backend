const Joi = require("joi");
const WebhookSubscription = require("../models/WebhookSubscription");
const WebhookEvent = require("../models/WebhookEvent");
const verifySignature = require("../utils/verifySignature");
const { webhookQueue } = require("../queues/webhookQueue");

const receiveWebhookEvent = async (req, res) => {
  try {
    const schema = Joi.object({
      eventType: Joi.string().required(),
      data: Joi.object().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const subscription = await WebhookSubscription.findById(req.params.subscriptionId);

    if (!subscription || !subscription.isActive) {
      return res.status(404).json({ message: "Active subscription not found" });
    }

    const signature = req.headers["x-hookpilot-signature"];

    if (signature) {
      const isValid = verifySignature(req.body, signature, subscription.secret);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid webhook signature" });
      }
    }

    if (
      subscription.eventTypes.length > 0 &&
      !subscription.eventTypes.includes(req.body.eventType)
    ) {
      return res.status(200).json({
        message: "Event ignored because it does not match subscription filter"
      });
    }

    const event = await WebhookEvent.create({
      subscription: subscription._id,
      eventType: req.body.eventType,
      payload: req.body,
      status: "received"
    });

    await webhookQueue.add(
      "process-webhook-event",
      { eventId: event._id.toString() },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 3000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    );

    const io = req.app.get("io");
    io.to(subscription.user.toString()).emit("webhook:new", event);

    res.status(202).json({
      message: "Webhook event received and queued",
      event
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to receive webhook event", error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const subscriptions = await WebhookSubscription.find({
      user: req.user._id
    }).select("_id");

    const subscriptionIds = subscriptions.map((sub) => sub._id);

    const events = await WebhookEvent.find({
      subscription: { $in: subscriptionIds }
    })
      .populate("subscription", "sourceName callbackUrl")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const subscriptions = await WebhookSubscription.find({
      user: req.user._id
    }).select("_id");

    const subscriptionIds = subscriptions.map((sub) => sub._id.toString());

    const event = await WebhookEvent.findById(req.params.id).populate(
      "subscription",
      "sourceName callbackUrl user"
    );

    if (!event || !subscriptionIds.includes(event.subscription._id.toString())) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event", error: error.message });
  }
};

module.exports = {
  receiveWebhookEvent,
  getEvents,
  getEventById
};