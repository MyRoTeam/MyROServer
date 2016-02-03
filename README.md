# NeverGoneBotServer

### Routes

| Route | HTTP Request | Content-Type     | Input(s) (**_JSON Format_**) | Output (**_JSON Format_**) | Description |
| :---: | :----------: | :--------------: | ---------------------------- | -------------------------- | ----------- |
| /users|     POST     | application/json | <ul><li>username (String)<ul><li>Must be atleast _three_ characters long</li></ul></li><li>password (String)<ul><li>Must be atleast _eight_ characters long</li></ul></li></ul> | <ul><li>_id (String)</li><li>username (String)</li></ul> | Create a new user |
| /users/:id | GET | application/json | None | <ul><li>_id (String)</li><li>username (String)</li></ul> | Get the corresponding user's details from the user ID supplied |
| /users/:id | PUT | application/json | <ul><li>username (String)<ul><li>_Optional_</li></ul></li></ul> | <ul><li>_id (String)</li><li>username (String)</li></ul> | Update the corresponding user's details from the user ID and the fields to update supplied |

### Socket.io Connection

| Port | Subscription Topic (Emit) | Publish Topic (On) | 
| :--: | :----------------: | :-----------: |
| 3000 | instruction | instruction |


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
