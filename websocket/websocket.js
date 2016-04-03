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

    /*
     * Runs on websocket initial connection only if the supplied
     * robot token was valid
     */
    this.onAuthenticated = function(socket) {
        socket.on('disconnect', this.onDisconnect);
<<<<<<< HEAD

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

=======
        socket.on('myro-instruction', this.onReceive);
        //socket.on('myro-instruction', this.onReceive(socket.decoded_token));
    };

    /*this.io.on('connection', this.ioJwt.authorize({
                secret: config.robotTokenSecret
            }))*/
    this.io.on('connection', this.onAuthenticated);
           //.on('authenticated', this.onAuthenticated);
>>>>>>> eeb69f3e61295e31953f255b4680aa0f106776d9
};

module.exports = WebSocket;
