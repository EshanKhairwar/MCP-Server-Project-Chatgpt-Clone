const { Server } = require("socket.io");
const aiService = require("../services/ai.service");
function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // or your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("ai-message", async (message) => {
      const result = await aiService.generateContent(message);
      console.log(result);
      socket.emit("ai-message-response", result);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });
}

module.exports = setupSocketServer;
