function WebSocket(http) {
    this.io = require('socket.io')(http);

    this.onDisconnect = function() {
        console.log('User Disconnected from WebSocket');
    };

    this.onReceive = function(msg) {
        console.log("Received Message: " + msg);

        this.io.emit('instruction', msg);
    };

    this.onConnection = function(socket) {
        socket.on('disconnect', this.onDisconnect);
        socket.on('instruction', this.onReceive);
    };

    this.io.on('connection', this.onConnection);
};

module.exports = WebSocket;
