const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const ACTIONS = require("../frotend/src/Actions").default;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socketUserMap = {};

function getAllConnectedUsers(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: socketUserMap[socketId],
    })
  );
}

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    socketUserMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedUsers(roomId);

    socket.to(roomId).emit(ACTIONS.JOINED, {
      clients,
      username,
      socketId: socket.id,
    });

    socket.emit(ACTIONS.JOINED, {
      clients,
      username,
      socketId: socket.id,
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: socketUserMap[socket.id],
      });
    });

    delete socketUserMap[socket.id];
  });
});

server.listen(3000, () => console.log("Server running on 3000"));
