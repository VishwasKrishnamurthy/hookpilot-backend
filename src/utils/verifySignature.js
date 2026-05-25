const crypto = require("crypto");

const verifySignature = (payload, signature, secret) => {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

module.exports = verifySignature;