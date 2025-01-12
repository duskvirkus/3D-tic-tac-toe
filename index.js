const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));

const server = require('http').createServer(app);

let roomCounter = 0;
const roomMatcher = new RegExp(/^[0-9]{1,19}$/);
const TARGET_ROOM_SIZE = 2;

<<<<<<< HEAD
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "clownfish-app-gft3y.ondigitalocean.app");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

const io = require('socket.io')(server);
=======
const io = require('socket.io')(server//, {
  // allowRequest: (req, cb) => {
  //   console.log("hello")
  //   console.log(req.headers)
  //   if (req.headers.host === "localhost:8080") {
  //     cb(null, true);
  //   }
  //   // const isAllowed = req.headers.origin === 'http://good.com';
  //   cb(null, false);
  // }
// }
);
>>>>>>> parent of 5335140 (cleanup)
io.on('connection', socket => {

  console.log(`${socket.id} is connected`);

  let room = joinRoom(socket);
  console.log(`room ${room}`);
  socket.emit('established');

  socket.on('move', data => {
    console.log(data);
    io.to(room).emit('player-move', data);
  });

  socket.on('disconnect', () => {
    // console.log(room + ' had a lost connection');
    // io.to(room).emit('connection-lost');
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
  console.log(`room list ${roomList}`)
  let keys = Object.keys(roomList);
  console.log(`room list keys ${keys}`)
  for (let i = 0; i < keys.length; i++) {
    console.log(`roomList[keys[i]] ${roomList[keys[i]]}`)
    if (roomList[keys[i]].size < TARGET_ROOM_SIZE) {
      return keys[i];
    }
  }
  return null;
}

function getRoomList() {
  let allRooms = io.sockets.adapter.rooms;
<<<<<<< HEAD
  // let keys = allRooms.keys().filter(key => key.match(roomMatcher));
  let rooms = {};
  allRooms.keys().forEach(key => {
    if (key.match(roomMatcher)) {
      rooms[key] = allRooms.get(key)
    }
=======
  console.log(allRooms.keys())
  // console.log(Object.keys(allRooms))
  let keys = allRooms.keys().filter(key => key.match(roomMatcher));
  console.log(`keys ${keys}`);
  let rooms = {};
  keys.forEach(key => {
    console.log(key)
    rooms[key] = allRooms.get(key)
>>>>>>> parent of 5335140 (cleanup)
  })
  // for (let key : keys) {
  //   console.log(key);
  // }
  // for (let i = 0; i < keys.length; i++) {
  //   console.log(`${i} ${keys[i]}`)
  //   rooms[keys[i]] = allRooms.get(keys[i]);
  // }
  console.log(rooms)
  return rooms;
}
function checkRoomSize(room) {
  console.log(io.sockets.adapter.rooms)
  if (io.sockets.adapter.rooms.get(room).size === TARGET_ROOM_SIZE) {
    console.log(io.sockets.adapter.rooms.get(room).keys())
    let socketsInRoom = io.sockets.adapter.rooms.get(room).keys();

    let index = 0;
    socketsInRoom.forEach(socket => {
      // console.log(`sockets connected ${io.sockets.connected.get(socket)}`)
      io.to(socket).emit('room-ready', {
        socketIDs: socketsInRoom,
        idInRoom: index,
        gameStartTime: Date.now() + 6000,
      });
      index++;
    })

    // console.log(socketsInRoom)
    // console.log()

    // for (let i = 0; i < socketsInRoom.length; ++i) {
    //   payload = {
    //     socketIDs: socketsInRoom,
    //     idInRoom: i,
    //     gameStartTime: Date.now() + 6000,
    //   };
    //   console.log(payload)
    //   io.to(socket).emit('room-ready', payload);
    // }
    // console.log(`socketsInRoom ${socketsInRoom}`)
    // for (let i = 0; i < socketsInRoom.length; i++) {
    //   console.log(`socketInRoom[${i}] ${socketsInRoom[i]}`)
    //   io.sockets.connected[socketsInRoom[i]].emit('room-ready', {
    //     socketIDs: socketsInRoom,
    //     idInRoom: i,
    //     gameStartTime: Date.now() + 6000,
    //   });
    // }
    console.log(room + ' is full');
    console.log(io.sockets.adapter.rooms.get(room));
  }
}

server.listen(port, () => console.log(`Server listening on port ${port}!`));