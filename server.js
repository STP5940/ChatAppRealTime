const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let onlineUsers = new Set();

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        socket.username = username;
        onlineUsers.add(username);
        io.emit('user list', Array.from(onlineUsers)); // Send the updated list to all clients
        socket.broadcast.emit('user joined', username);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', socket.username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            onlineUsers.delete(socket.username);
            io.emit('user list', Array.from(onlineUsers)); // Send the updated list to all clients
            io.emit('user left', socket.username);
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
