const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));

const server = require('http').createServer(app);

let roomCounter = 0;
const roomMatcher = new RegExp(/^[0-9]{1,19}$/);
const TARGET_ROOM_SIZE = 2;

const io = require('socket.io')(server);
io.on('connection', socket => {

  console.log(`${socket.id} is connected`);

  let room = joinRoom(socket);
  socket.emit('established');

  socket.on('move', data => {
    io.to(room).emit('player-move', data);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} was disconnected`);
  });
  
});

function joinRoom(socket) {
  let room = roomToJoin();
  if (room === null) {
    room = roomCounter.toString();
    roomCounter++;
  }
  socket.join(room);
  checkRoomSize(room);
  return room;
}

function roomToJoin() {
  let roomList = getRoomList();
  let keys = Object.keys(roomList);
  for (let i = 0; i < keys.length; i++) {
    if (roomList[keys[i]].size < TARGET_ROOM_SIZE) {
      return keys[i];
    }
  }
  return null;
}

function getRoomList() {
  let allRooms = io.sockets.adapter.rooms;
  let keys = allRooms.keys().filter(key => key.match(roomMatcher));
  let rooms = {};
  keys.forEach(key => {
    rooms[key] = allRooms.get(key)
  })
  return rooms;
}

function checkRoomSize(room) {
  if (io.sockets.adapter.rooms.get(room).size === TARGET_ROOM_SIZE) {
    let socketsInRoom = io.sockets.adapter.rooms.get(room).keys();

    let index = 0;
    socketsInRoom.forEach(socket => {
      io.to(socket).emit('room-ready', {
        socketIDs: socketsInRoom,
        idInRoom: index,
        gameStartTime: Date.now() + 6000,
      });
      index++;
    })
    console.log(`room is full ${room}`)
  }
}

server.listen(port, () => console.log(`Server listening on port ${port}!`));