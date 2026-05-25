const jwt = require("jsonwebtoken");

const initSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Socket token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);
    console.log(`Socket connected: ${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });
};

module.exports = initSocket;