const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const router = require("./router");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

corsOptions = {
  cors: true,
  origins: ["http://localhost:3000"],
};
const io = socketio(server, corsOptions);

app.use(router);

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, cb) => {
    console.log(name, room);
  });

  socket.on("disconnect", () => {
    console.log("User had left!");
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
