const fetch = require('node-fetch');
const Room = require('../models/room');

module.exports = (app, io) => {
  // When a listener joins a room
  app.post('/joinRoom', async (req, res) => {
    Room.findById(req.body.roomId, async (err, room) => {
      if (err) {
        console.error('(joinRoom) There was an error');
      } else if (room) {
        const infoRes = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${req.body.accessToken}` },
        });
        const infoResJSON = await infoRes.json();

        const pictureSrc = infoResJSON.images.length > 0
          ? infoResJSON.images[0].url : '../defaultPerson.png';

        if (infoResJSON) {
          const newListener = {
            name: infoResJSON.display_name ? infoResJSON.display_name : 'Listener',
            spotifyURI: infoResJSON.uri,
            pictureSrc,
            refreshToken: req.body.refreshToken,
          };
          // 1. Add the new listener to the room
          room.roomListeners.push(newListener);
          // 2. Save the room
          room.save((localErr, localRoom) => {
            if (localErr) {
              console.log(`(joinRoom)${localErr}`);
            } else {
              // 3. Tell the current listeners about the new one
              io.sockets.in(req.body.roomId).emit('newListeners', localRoom.roomListeners);
              // 4. Send a response back
              res.json({ success: true });
            }
          });
        }
      } else {
        res.json({ success: false });
      }
    });
  });
};
