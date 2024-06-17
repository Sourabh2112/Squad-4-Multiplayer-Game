import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

console.log('Check');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
  },
});

const rooms = new Map();

io.on('connection', (socket) => {
  // ...
  console.log(`User Joined with Id: ${socket.id}`);
  socket.on('add_tile', (columnIndex, roomName) => {
    console.log('Event Received');
    console.log(roomName);
    io.emit('add_til', columnIndex, roomName);
  });

  socket.on('createRoom', (roomName) => {
    const room = { count: 0 };
    // Add the room to the map
    socket.join(roomName);
    rooms.set(roomName, room);
    console.log(rooms);
  });

  // At set interval u can emit game state
  //   setInterval(() => {
  //     io.emit("gameState", game)
  // }, 1000/FPS)

  socket.on('joinRoom', (roomName, playerId) => {
    // Check if the room already exists in the map
    if (!rooms.has(roomName)) {
      socket.emit('invalidRoom');
      return;
    }

    // Retrieve the room object

    socket.join(roomName);
    const room = rooms.get(roomName);
    room['count']++;
    const userNumber = room['count'];
    console.log(userNumber);
    const numOfUserInRoom = Object.keys(room).length;
    const clientId = playerId;
    console.log('The player is id ' + playerId + 'didnt work');
    const role = numOfUserInRoom <= 2 ? 'Player' : 'Spectator';

    // Add the client to the room with the specified role
    console.log(roomName, clientId, role, numOfUserInRoom);
    room[clientId] = role;
    // Update the room in the map
    rooms.set(roomName, room);

    // Emit a success message to the client
    socket.emit('joinRoomSuccess', role, numOfUserInRoom);
    io.to(roomName).emit('roomUpdate', numOfUserInRoom);

    // Broadcast the updated room data to all clients in the room
    console.log(`User joined room: ${roomName}`);
    // Join the room
    console.log(rooms);

    // Create a new room object with the client and role
  });

  //! NOT WORKING, the playerId doesnt match or something liketaht

  socket.on('leaveRoom', (playerId) => {
    console.log(`A user left room ${socket.id}`);
    rooms.forEach((room, roomName) => {
      console.log(room, playerId, room[playerId]);
      if (room[playerId]) {
        // Remove the client from the room
        delete room[playerId];
        room['count']--;
        rooms.set(roomName, room);
        // if (Object.keys(room).length == 1) rooms.delete(roomName);
        // Update the room in the map
        console.log(rooms);
        return;
      }
    });

    socket.on('disconnect', () => {
      console.log(`A user disconnected ${socket.id}`);
    });
  });
});

httpServer.listen(3000);
