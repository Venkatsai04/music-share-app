const Room = require('../models/room');

module.exports = (app) => {
  app.post('/getPlaybackInfo', (req, res, next) => {
    Room.findById(req.body.roomId, (err, room) => {
      if (err) { console.log('(getPlaybackInfo) Error finding room'); } else if (room) {
        res.json({
          name: room.name,
          creator: room.creator,
          listeners: room.roomListeners,
          upcomingSongs: room.upcomingSongs,
          currentSong: room.currentSong,
          recentSongs: room.recentSongs,
        });
      }
    });
  });
};
