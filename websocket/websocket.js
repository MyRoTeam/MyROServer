const config = require('../config');

function WebSocket(http) {
    this.io = require('socket.io')(http);
    this.ioJwt = require('socketio-jwt');

    this.onDisconnect = function() {
        console.log('User Disconnected from WebSocket');
    };

    this.onReceive = function(msg) {
        console.log("Received Message: " + msg);

        this.io.emit('myro-instruction', msg);
    };

    this.onReceive = function(udid) {
        return function(msg) {
            console.log("Received Message: " + msg);
            this.io.emit('myro-instruction-' + udid, msg);
        };
    };

    this.onAuthenticated = function(socket) {
        socket.on('disconnect', this.onDisconnect);
        socket.on('myro-instruction', this.onReceive);
        //socket.on('myro-instruction', this.onReceive(socket.decoded_token));
    };

    /*this.io.on('connection', this.ioJwt.authorize({
                secret: config.robotTokenSecret
            }))*/
    this.io.on('connection', this.onAuthenticated);
           //.on('authenticated', this.onAuthenticated);
};

module.exports = WebSocket;
