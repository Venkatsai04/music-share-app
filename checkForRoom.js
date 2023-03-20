const Room = require('../models/room');

module.exports = (app) => {
  app.post('/checkForRoom', async (req, res) => {
    Room.findById(req.body.roomId, (err, room) => {
      if (err) {
        console.error('(checkForRoom) There was an error');
        console.error(err);
      } else if (room) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    });
  });
};
