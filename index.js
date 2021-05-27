const express = require("express");
const socketio = require("socket.io");
const http = require("http");
require("dotenv").config();

const router = require("./router");
const { addUser, removeUser, getUser, getUserInRoom } = require("./user");

// Porta que rodará o servidor
const PORT = Number(process.env.PORT);

const app = express();

// Inicia o servidor via websocket
const server = http.createServer(app);

// Garante que apenas a nossa página poderá acessar o servidor
corsOptions = {
  cors: true,
  origins: [process.env.REACT_APP_URL],
};

// instancia o socket.io no nosso servidor com nossa página
const io = socketio(server, corsOptions);

app.use(router);

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, cb) => {
    // Assim que entra na sala é criado o usuario a partir dos dados da pagina Join com o id gerado automaticamente pelo socket.io
    const { error, user } = addUser({ id: socket.id, name, room });
    // Caso de algum erro na criação do usuario é emitido uma mensagem de erro pela callback
    if (error) return cb(error);

    // Emite uma mensagem para o usuario que acabou de logar no room
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to ${user.room}`,
    });

    // Emite uma mensagem para todos os outros usuarios do room que entrou mais uma pessoa
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: ` ${user.name} has joined` });

    socket.join(user.room);

    cb();
  });

  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    cb();
  });

  socket.on("disconnect", () => {
    console.log("User had left!");
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
