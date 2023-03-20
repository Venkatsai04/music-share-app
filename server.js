require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// Separate databases for development and production
let mongoURI = '';
if (process.env.NODE_ENV === 'production') {
  const dbUsername = process.env.PROD_DB_USERNAME;
  const dbPassword = process.env.PROD_DB_PASSWORD;
  //mongoURI = `mongodb://${dbUsername}:${dbPassword}@ds263146.mlab.com:63146/heroku_7nkz6h4b`;
  mongoURI = `mongodb://${dbUsername}:${dbPassword}@ds047448.mlab.com:47448/octaveweb`
} else {
  const dbUsername = process.env.DEV_DB_USERNAME;
  const dbPassword = process.env.DEV_DB_PASSWORD;
  mongoURI = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0-qrjhy.mongodb.net/test?retryWrites=true`;
}

mongoose.connect(mongoURI, { useNewUrlParser: true });

const port = process.env.PORT || 5000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom middleware
require('./server/joinRoom.js')(app, io);
require('./server/socketio/setup')(io);
require('./server/socketio/nextSong.js')(io);
require('./server/socketio/previousSong.js')(io);
require('./server/socketio/togglePlayback.js')(io);
require('./server/socketio/toggleShuffle.js')(io);
require('./server/socketio/changeRoomName.js')(io);
require('./server/socketio/leaveRoom.js')(io);
require('./server/socketio/storeDate.js')(io);
require('./server/socketio/togglePublic.js')(io);
require('./server/socketio/clearQueue.js')(io);
require('./server/getRooms')(app);
require('./server/updateTokens')(app);
require('./server/sendInitData')(app);
require('./server/createRoom')(app);
require('./server/addToQueue')(app);
require('./server/getCreatorId')(app);
require('./server/getCreatorPlayback')(app);
require('./server/getPlaybackInfo')(app);
require('./server/updateCreatorAccessToken')(app);
require('./server/checkRoomsForDeletion')(app);
require('./server/checkForRoom')(app);

// Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build/index.html')));
}
// Development
else {
  app.use(express.static(path.join(__dirname, 'client/public')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/public/index.html')));
}

server.listen(port, () => console.log(`Listening on port ${port}`));
