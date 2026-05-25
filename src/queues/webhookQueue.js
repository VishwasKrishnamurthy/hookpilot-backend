const { Queue, Worker } = require("bullmq");
const IORedis = require("ioredis");
const WebhookEvent = require("../models/WebhookEvent");

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null
});

const webhookQueue = new Queue("webhook-events", { connection });

const startWebhookWorker = (io) => {
  const worker = new Worker(
    "webhook-events",
    async (job) => {
      const { eventId } = job.data;

      const event = await WebhookEvent.findById(eventId).populate("subscription");

      if (!event) {
        throw new Error("Event not found");
      }

      event.status = "processing";
      event.retryCount = job.attemptsMade;
      await event.save();

      io.to(event.subscription.user.toString()).emit("webhook:update", event);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        event.status = "processed";
        event.processedAt = new Date();
        event.errorMessage = undefined;
        await event.save();

        io.to(event.subscription.user.toString()).emit("webhook:update", event);

        return event;
      } catch (error) {
        event.status = "failed";
        event.retryCount = job.attemptsMade + 1;
        event.errorMessage = error.message;
        await event.save();

        io.to(event.subscription.user.toString()).emit("webhook:update", event);

        throw error;
      }
    },
    { connection }
  );

  worker.on("failed", async (job, error) => {
    const event = await WebhookEvent.findById(job.data.eventId).populate("subscription");

    if (event) {
      event.status = "failed";
      event.retryCount = job.attemptsMade;
      event.errorMessage = error.message;
      await event.save();

      io.to(event.subscription.user.toString()).emit("webhook:update", event);
    }
  });

  console.log("Webhook queue worker started");
};

module.exports = { webhookQueue, startWebhookWorker };