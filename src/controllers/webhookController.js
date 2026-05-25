const Joi = require("joi");
const WebhookSubscription = require("../models/WebhookSubscription");

const subscribeWebhook = async (req, res) => {
  try {
    const schema = Joi.object({
      sourceName: Joi.string().min(2).required(),
      sourceUrl: Joi.string().uri().required(),
      callbackUrl: Joi.string().uri().required(),
      eventTypes: Joi.array().items(Joi.string()).default([])
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const subscription = await WebhookSubscription.create({
      user: req.user._id,
      sourceName: req.body.sourceName,
      sourceUrl: req.body.sourceUrl,
      callbackUrl: req.body.callbackUrl,
      eventTypes: req.body.eventTypes
    });

    res.status(201).json({
      message: "Webhook subscribed successfully",
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: "Subscription failed", error: error.message });
  }
};

const getWebhooks = async (req, res) => {
  try {
    const subscriptions = await WebhookSubscription.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscriptions", error: error.message });
  }
};

const getWebhookById = async (req, res) => {
  try {
    const subscription = await WebhookSubscription.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscription", error: error.message });
  }
};

const cancelWebhook = async (req, res) => {
  try {
    const subscription = await WebhookSubscription.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.isActive = false;
    await subscription.save();

    res.json({ message: "Webhook subscription cancelled", subscription });
  } catch (error) {
    res.status(500).json({ message: "Cancellation failed", error: error.message });
  }
};

module.exports = {
  subscribeWebhook,
  getWebhooks,
  getWebhookById,
  cancelWebhook
};