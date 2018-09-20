const http = require("http");
const socketio = require("socket.io");

const server = http.createServer((req, res) => {
  res.end("asd");
});

server.listen(1200);
const io = socketio.listen(server);

io.on("connection", socket => {
  console.log("a user connected");

  socket.on("joinRoom", data => {
    socket.join(data.roomName, () => {
      let count = io.sockets.adapter.rooms[data.roomName].length;
      io.to(data.roomName).emit("emitRoom", {
        count: count,
        roomName: data.roomName,
        username: data.username
      });
      socket.emit("emitUser", { username: data.username });
    });

    // socket.broadcast.emit('broadcastUser', {username: data.username});
  });

  socket.on("newMessage", data => {
    socket.broadcast.emit("broadcastMessage", {
      message: data.message,
      username: data.username
    });
    socket.emit("selfMessage", {
      message: data.message,
      username: data.username
    });
  });

  socket.on("disconnect", () => {
    console.log("user is disconnect");
  });
});
