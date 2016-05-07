# NeverGoneBotServer

### Routes

| Route | HTTP Request | Content-Type     | Input(s) (**_JSON Format_**) | Output (**_JSON Format_**) | Description |
| :---: | :----------: | :--------------: | ---------------------------- | -------------------------- | ----------- |
| /users|     POST     | application/json | <ul><li>username (String)<ul><li>Must be atleast _three_ characters long</li></ul></li><li>password (String)<ul><li>Must be atleast _eight_ characters long</li></ul></li></ul> | <ul><li>_id (String)</li><li>username (String)</li></ul> | Create a new user and returns a status code of 201 if successful |
| /users/:id | GET | application/json | None | <ul><li>_id (String)</li><li>username (String)</li></ul> | Get the corresponding user's details from the user ID supplied |
| /users/:id | PUT | application/json | <ul><li>username (String)<ul><li>_Optional_</li></ul></li></ul> | <ul><li>_id (String)</li><li>username (String)</li></ul> | Update the corresponding user's details from the user ID and the fields to update supplied |
| /users/login | POST | application/json | <ul><li>username (String)</li><li>password (String)</li></ul> | <ul><li>status (String)</li><li>message (String)</li><li>user (User JSON)</li></ul> | Attempts to authenticate a user based on the username and password provided. Returns a status code of 401 if authorization fails, otherwise it will return a status code of 200 |
| /users/:id/connect | POST | application/json | <ul><li>code (robot's six alphanumeric code)</li></l> | <ul><li>robotToken (must be supplied with websocket)</li></ul> | Used to get the robotToken for the given robot's code, which is then used to connect to the robot via websocket |
| /robots | POST | application/json | <ul><li>name (String)</li><li>udid</li></ul> | <ul><li>_id</li><li>name (String)</li><li>udid (String)</li><li>code</li></ul> | Creates a new robot application and adds it to the database |
| /robots/:id | GET | application/json | None | <ul><li>name (String)</li><li>udid (String)</li><li>code</li></ul> | Retrieves the robot info for the given unique ID |
|/robots/findByUdid | GET | application/json | <ul><li>udid (String)</li></ul> | <ul><li>name (String)</li><li>udid (String)</li><li>code</li></ul> | Gets robot by UDID |
|/places/ | GET | application/json | <ul><li>lat (Double)</li><li>lng (Double)</li><li> radius (Double)</li><li> keyword -optional (String)</li></ul> | <ul><li> landmarks (JSON array - see contents [here](https://developers.google.com/places/web-service/search#PlaceSearchResponses)) | Returns a list of landmarks within the radius of the given latitude and longitude from Google Places data, if a keyword is given then  the places will be filtered and only locations that match keyword will be returned |

### Socket.io Connection

| Subscription Topic (On) | Publish Topic (Emit) |
| :----------------: | :-----------: |
| myro-instruction-{ROBOT APP UDID} | myro-instruction |

On client connection, you must supply the the robotToken that you received from the /users/:id/connect API request. Using socket.io, the parameter should be called "token".


## Starting the Server Up

### Installing MongoDB on OS X

Run the following commands in the terminal
```
$ brew update
$ brew install mongodb
$ sudo mkdir -p /data/db
$ sudo chown `id -u` /data/db
```

To check if MongoDB was successfully installed on your mac, run:
```
$ mongod --version
```

Run MongoDB:
```
$ mongod
```

### Running the Server

You must have the following packages in your bin to run in the terminal:
- npm
- node

1) Clone repository
```
$ git clone https://github.com/NeverGoneBot/NeverGoneBotServer.git && cd NeverGoneBotServer
```

2) Install all the modules required:
```
$ npm install
```

3) Run the server
```
$ node app.js
```
