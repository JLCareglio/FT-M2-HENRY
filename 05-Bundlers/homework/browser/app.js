// var whiteboard = window.whiteboard; // Obj EventEmitter (intancia) con sus metodos
var whiteboard = require("./whiteboard");

var io = require("socket.io-client");
var socket = io(window.location.origin);

// --> ES6
// import {whiteboard} from './whiteboard'
// import {io} from 'socket.io-client'



// var socket = window.io(window.location.origin); --> estamos importando socket IO --> lo invocamos pasandole location origin

socket.on("connect", function () {
  console.log("Connected!");
});

socket.on("load", function (strokes) {
  strokes.forEach(function (stroke) {
    var start = stroke.start;
    var end = stroke.end;
    var color = stroke.color;
    whiteboard.draw(start, end, color, false);
  });
});

socket.on("draw", function (start, end, color) {
  whiteboard.draw(start, end, color, false);
});

whiteboard.on("draw", function (start, end, color) {
  socket.emit("draw", start, end, color);
});
