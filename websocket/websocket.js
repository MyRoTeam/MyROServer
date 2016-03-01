const config = require('../config');

/*
 * Websocket broker between client and robot,
 * which is primarily used to send instructions
 * from the client to a specific robot
 */
function WebSocket(http) {
    this.io = require('socket.io')(http);
    this.ioJwt = require('socketio-jwt');

    this.onDisconnect = function() {
        console.log('User Disconnected from WebSocket');
    };

    this.onReceive = function(udid) {
        return function(msg) {
            console.log("Received Message: " + msg);

            /* Sends the message to the robot who has the supplied UDID */
            this.io.emit('instruction-' + udid, msg);
        };
    };

    /*
     * Runs on websocket initial connection only if the supplied
     * robot token was valid
     */
    this.onAuthenticated = function(socket) {
        socket.on('disconnect', this.onDisconnect);

        /* 
         * decoded_token.udid is the robot's unique UDID which was used
         * to generate the token
         */
        socket.on('instruction', this.onReceive(socket.decoded_token.udid));
    };

    /*
     * Authenticate supplied robot token that the user retrieved
     * from calling the /users/:id/connect api route. Websocket
     * connection will only be successful if the robot token
     * is successfully verified
     */
    this.io.on('connection', this.ioJwt.authorize({ secret: config.robotTokenSecret }))
        .on('authenticated', this.onAuthenticated);

};

module.exports = WebSocket;
