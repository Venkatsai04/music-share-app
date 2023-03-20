const Room = require('../../models/room');

module.exports = (io) => {
    io.on('connection', client => {
        //Update database and send back info
        client.on('clearQueue', roomId => {
            Room.findById(roomId, async (err, room) => {
                if (err) {
                    console.error('(changeRoomName)' + err);
                }
                else {
                    if (room) {
                        room.upcomingSongs = [];
                        room.save(err => {
                            if (err) {
                                console.error('clearQueue) Error when saving room' + err);
                            }
                            else {
                                io.sockets.in(roomId).emit('clearUpcomingSongs');
                            }
                        });
                    }
                }
            });
        });
    });
}