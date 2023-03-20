const fetch = require('node-fetch');
const Room = require('../models/room');

module.exports = (app) => {
  app.post('/getCreatorPlayback', async (req, res) => {
    // 1. Find the room
    Room.findById(req.body.roomId, async (err, room) => {
      if (err) { console.log('(getCreatorPlayback) Error finding room'); } else {
        // 2. Get the creator playback informatoin
        const creatorInfoRes = await fetch('https://api.spotify.com/v1/me/player', {
          headers: { Authorization: `Bearer ${room.creator.accessToken}` },
        });
        if (creatorInfoRes.status === 200) {
          const creatorInfoResJSON = await creatorInfoRes.json();
          const currentSong = creatorInfoResJSON.item.uri;
          const currentPosition = creatorInfoResJSON.progress_ms;
          const isPlaying = creatorInfoResJSON.is_playing;

          // 2. Return that information to the listener
          // Need to return:
          // currentSong is the spotifyURI of the creators current song
          // currentPosition is the current position of the creator in the track
          // isPlaying is whether or not the creator is playing a song
          res.json({
            success: true,
            currentSong,
            currentPosition,
            isPlaying,
          });
        } else {
          console.log('(getCreatorPlayback) There was an issue when getting playback');
          res.json({ success: false });
        }
      }
    });
  });
};
