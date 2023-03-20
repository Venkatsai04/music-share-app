const Room = require('../models/room');

module.exports = (app) => {
  app.post('/addToQueue', (req, res) => {
    // The type of request (song, playlist, songs)
    const { type } = req.body;

    // The data to be added
    const { data } = req.body;

    // Find the room and update it
    Room.findById(req.body.roomId, (err, room) => {
      if (err) {
        console.error(err);
        console.error('(addToQueue) Could not find the room.');
      }
      if (room) {
        if (type === 'song') {
          if (room.currentSong.spotifyURI === data.spotifyURI) {
            res.json({
              success: false,
              message: 'A song can only be added once',
            });
          } else {
            let songAlreadyAdded = false;
            room.upcomingSongs.forEach((song) => {
              if (song.spotifyURI === data.spotifyURI) {
                songAlreadyAdded = true;
              }
            });
            if (songAlreadyAdded) {
              res.json({
                success: false,
                message: 'A song can only be added once',
              });
            } else {
              // Play the song later
              if (req.body.shouldAppend) {
                room.upcomingSongs.push(data);
              } else {
                room.upcomingSongs.unshift(data);
              }
              room.save((saveErr, saveRoom) => {
                if (err) {
                  console.error(`(addToQueue) saving room${saveErr}`);
                } else if (saveRoom) {
                  res.json({
                    success: true,
                    nextSongs: room.upcomingSongs,
                    msg: `${data.name} by ${data.artist}`,
                  });
                }
              });
            }
          }
        } else if (type === 'songs') {
          const songs = [];
          data.forEach((songObject) => {
            /*
                        Currently, the songs we are getting from the client are saved in the form
                        { title, artist, album, imgSrc, uri}
                        They need to be in the form
                         {name, artist, album, spotifyURI, albumArtSrc}
                         */
            const newSong = {
              name: songObject.props.title,
              artist: songObject.props.artist,
              album: songObject.props.album,
              spotifyURI: songObject.props.uri,
              albumArtSrc: songObject.props.imgSrc,
            };
            songs.push(newSong);
          });

          // If we should append the songs to the queue
          if (req.body.shouldAppend) {
            // eslint-disable-next-line no-param-reassign
            room.upcomingSongs = room.upcomingSongs.concat(songs);
          }
          // If we should play the songs next
          else {
            // eslint-disable-next-line no-param-reassign
            room.upcomingSongs = songs.concat(room.upcomingSongs);
          }
          room.save((localErr, localRoom) => {
            if (localErr) {
              console.error(`(addToQueue) : ${localErr}`);
              res.json({
                success: false,
                message: 'Sorry, we could not add those songs',
              });
            }
            if (localRoom) {
              res.json({
                success: true,
                nextSongs: room.upcomingSongs,
                message: '',
              });
            }
          });
        } else {
          res.json({
            success: false,
            message: 'Not the correct data type',
          });
        }
      }
    });
  });
};
