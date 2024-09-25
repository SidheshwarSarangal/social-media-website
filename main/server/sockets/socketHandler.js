// sockets/socketHandlers.js
module.exports.handleSocketConnections = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chat ${chatId}`);
        });

        socket.on('sendMessage', ({ chatId, message }) => {
            io.to(chatId).emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
