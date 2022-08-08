var path = require("path");

var http = require("http");
var server = http.createServer();

var express = require("express");
var app = express();

var socketio = require("socket.io");

server.on("request", app);

var io = socketio(server);

var inMemoryDrawHistory = [];

server.listen(3001, function () {
  console.log("The server is listening on port 3001!");
});

app.use(express.static(path.join(__dirname, "browser")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", function (socket) {
  console.log(socket.id, "connected");

  socket.emit("load", inMemoryDrawHistory);

  socket.on("draw", function (start, end, color) {
    inMemoryDrawHistory.push({
      start: start,
      end: end,
      color: color,
    });
    socket.broadcast.emit("draw", start, end, color);
  });

  socket.on("disconnect", function () {
    console.log("Goodbye, ", socket.id, " :(");
  });
});
