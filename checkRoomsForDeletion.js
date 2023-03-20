const Room = require('../models/room');

module.exports = () => {
  const checkForDeletion = () => {
    Room.find({}, (err, rooms) => {
      if (err) { console.log(err); } else if (rooms) {
        rooms.forEach((room) => {
          // The number of milliseconds that the room needs to be
          // later than the current time to delete it
          const TIME_TO_DELETE = 10000;
          const currentTime = new Date();

          // If the creator of the room has not checked in in 10 seconds,
          // assume that no one is left in the room and delete it
          const timeDifference = Math.abs(currentTime - room.recentTime);
          if (timeDifference > TIME_TO_DELETE) {
            Room.findByIdAndDelete(room._id, (err, room) => {
              if (err) { console.error(`Error when deleting room: ${err}`); }
            });
          }
        });
      }
    });
  };
  setInterval(checkForDeletion, 3000);
};
