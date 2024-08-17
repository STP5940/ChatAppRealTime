module.exports = function (io) {
    const userNamespace = io.of('/api/socket');

    let onlineUsers = new Set();

    userNamespace.on('connection', (socket) => {
        socket.on('join', (username) => {
            socket.username = username;
            onlineUsers.add(username);
            userNamespace.emit('user list', Array.from(onlineUsers));
            socket.broadcast.emit('user joined', username);
        });

        socket.on('chat message', (msg) => {
            userNamespace.emit('chat message', msg);
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
                userNamespace.emit('user list', Array.from(onlineUsers));
                userNamespace.emit('user left', socket.username);
            }
        });
    });
};
