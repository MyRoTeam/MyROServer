const config = require('../config');

function WebSocket(http) {
    this.io = require('socket.io')(http);
    this.ioJwt = require('socketio-jwt');

    this.onDisconnect = function() {
        console.log('User Disconnected from WebSocket');
    };

    this.onReceive = function(msg) {
        console.log("Received Message: " + msg);

        this.io.emit('instruction', msg);
    };

    this.onReceive = function(udid) {
        return function(msg) {
            console.log("Received Message: " + msg);
            this.io.emit('instruction-' + udid, msg);
        };
    };

    this.onAuthenticated = function(socket) {
        socket.on('disconnect', this.onDisconnect);
        socket.on('instruction', this.onReceive(socket.decoded_token));
    };

    this.io.on('connection', this.ioJwt.authorize({
                secret: config.robotTokenSecret
            }))
           .on('authenticated', this.onAuthenticated);

};

module.exports = WebSocket;
