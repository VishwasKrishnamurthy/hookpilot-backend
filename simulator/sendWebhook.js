require("dotenv").config();

const axios = require("axios");
const crypto = require("crypto");

const subscriptionId = process.argv[2];
const secret = process.argv[3];

if (!subscriptionId) {
  console.log("Usage: npm run simulate <subscriptionId> <secret>");
  process.exit(1);
}

const payload = {
  eventType: "payment.success",
  data: {
    paymentId: "PAY_" + Date.now(),
    amount: 1499,
    currency: "INR",
    customer: {
      name: "Demo User",
      email: "demo@example.com"
    },
    createdAt: new Date().toISOString()
  }
};

const headers = {
  "Content-Type": "application/json"
};

if (secret) {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  headers["x-hookpilot-signature"] = signature;
}

const sendWebhook = async () => {
  try {
    console.log("Sending webhook...");
    console.log("Subscription ID:", subscriptionId);

    const response = await axios.post(
      `http://localhost:${process.env.PORT || 5000}/api/events/${subscriptionId}`,
      payload,
      { headers }
    );

    console.log("Webhook sent successfully");
    console.log(response.data);
  } catch (error) {
    console.log("Webhook failed");
    console.log(error.response?.data || error.message);
  }
};

sendWebhook();