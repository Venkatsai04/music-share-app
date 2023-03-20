const request = require('request');
const Room = require('../models/room');
require('dotenv').config();

module.exports = (app) => {
  app.post('/updateCreatorAccessToken', (req) => {
    // Find the room and update it
    Room.findById(req.body.roomId, (err, room) => {
      if (err) {
        console.error(err);
        console.error('(updateCreatorAccessToken) There was an error when trying to find the room');
      }
      if (room) {
        // Update token from server
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            grant_type: 'refresh_token',
            refresh_token: room.creator.refreshToken,
          },
          headers: {
            // eslint-disable-next-line no-buffer-constructor
            Authorization: `Basic ${new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
          },
          json: true,
        };
        request.post(authOptions, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            // Update room
            // eslint-disable-next-line no-param-reassign
            room.creator.accessToken = body.access_token;
            room.save((localErr) => {
              if (localErr) { console.error('(updateCreatorAccessToken) could not save room.'); }
            });
          } else {
            console.error('(updateCreatorAccessToken)');
            console.error(error);
          }
        });
      }
    });
  });
};
