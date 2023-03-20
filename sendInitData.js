const request = require('request');
require('dotenv').config();

module.exports = (app) => {
  app.post('/sendInitData', async (req, res) => {
    const { code } = req.body;
    const { state } = req.body;

    const redirect_uri = process.env.NODE_ENV === 'production'
      ? process.env.PROD_URI : process.env.DEV_URI;

    if (state == null) {
      console.log('State mismatch error');
    } else {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          code,
          redirect_uri,
          grant_type: 'authorization_code',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        },
        json: true,
      };
      request.post(authOptions, (error, response, body) => {
        if (error) {
          console.error('(sendInitData)');
          console.error(error);
        } else if (response.statusCode === 200) {
          const accessToken = body.access_token;
          const refreshToken = body.refresh_token;

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: `Bearer ${body.access_token}` },
            json: true,
          };

          // Send data back to client
          request.get(options, (_, __, localbody) => {
            res.json({
              name: localbody.display_name,
              accessToken,
              refreshToken,
            });
          });
        } else {
          console.log('(sendInitData)');
          console.log(response);
        }
      });
    }
  });
};
