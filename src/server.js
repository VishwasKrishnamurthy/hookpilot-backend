require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./sockets/socket");
const { startWebhookWorker } = require("./queues/webhookQueue");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

app.set("io", io);

initSocket(io);
startWebhookWorker(io);

server.listen(PORT, () => {
  console.log(`HookPilot backend running on port ${PORT}`);
});