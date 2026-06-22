const { Server } = require("socket.io");

let io;

function initIO(server) {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    return io;
}

function getIO() {

    if (!io) {

        throw new Error(
            "Socket.io not initialized"
        );

    }

    return io;
}

module.exports = {
    initIO,
    getIO
};