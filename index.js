import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { DbConfig } from './DbConfig/DbConfig.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

const addUser = (userName, roomId, socketId) => {
  users.push({
    userName: userName,
    roomId: roomId,
    socketId: socketId,
  });
  console.log('users:', users);
};

const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const userLeave = (userName) => {
  return users.filter((user) => user.userName !== userName);
};

const getRoomUsers = (roomId) => {
  return users.filter((user) => user.roomId === roomId);
};

io.on('connection', (socket) => {
  console.log('Someone Connected');

  socket.on('join-room', ({ roomId, userName }) => {
    socket.userName = userName;
    socket.join(roomId);
    addUser(userName, roomId, socket.id);
    socket.to(roomId).emit('user-connected', userName); // this will inform all users(excluding the new user) that a new user has connected to the room

    io.to(roomId).emit('all-users', getRoomUsers(roomId)); // this will get all the users including userself
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.roomId).emit('all-users', getRoomUsers(user.roomId));
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
