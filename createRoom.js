const fetch = require('node-fetch');
const Room = require('../models/room');

module.exports = (app) => {
  // The method to test if the database is connected
  app.post('/createRoom', async (req, res) => {
    // Perform a request to Spotify to get
    // the spotifyURI of this person and their name
    const {
      isPublic, roomName, accessToken, refreshToken, currentSong,
    } = req.body;

    const userRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true,
    });

    const userResJson = await userRes.json();
    // eslint-disable-next-line camelcase
    const { display_name, id } = userResJson;

    let pictureSrc = '';
    if (userResJson.images.length === 0) {
      pictureSrc = '../defaultPerson.png';
    } else {
      pictureSrc = userResJson.images[0].url;
    }

    // Now we create the room
    let room = new Room({
      name: roomName,
      public: isPublic,
      restricted: false,
      creator: {
        name: display_name,
        spotifyURI: id,
        accessToken,
        refreshToken,
        pictureSrc,
      },
      roomListeners: [],
      upcomingSongs: [],
      currentSong,
      recentSongs: [],
    });

    // Make sure that we do not have any id collisions
    // since we are creating our own ids
    let roomIdCollision = true;
    while (roomIdCollision) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await Room.findById(room.id, (existingRoom) => {
          // Collision
          if (existingRoom) {
            room = new Room({
              name: roomName,
              public: isPublic,
              restricted: false,
              creator: {
                name: display_name,
                spotifyURI: id,
                accessToken,
                refreshToken,
                pictureSrc,
              },
              roomListeners: [],
              upcomingSongs: [],
              currentSong,
              recentSongs: [],
            });
          } else {
            roomIdCollision = false;
          }
        });
      } catch (e) {
        console.error(e);
        res.json({ success: false });
      }
    }

    // Save the room in the database
    room.save((err, room) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({
          success: true,
          roomID: room._id,
        });
      }
    });
  });
};
