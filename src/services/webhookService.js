const processWebhookEvent = async (event) => {
  return {
    success: true,
    eventId: event._id
  };
};

module.exports = { processWebhookEvent };