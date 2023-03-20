const Room = require('../../models/room');

module.exports = (io) => {
    io.on('connection', client => {
        //Update database and send back info
        client.on('togglePublic', roomId => {
            Room.findById(roomId, async (err, room) => {
                if (!err && room) {
                    room.public = !room.public;
                    room.save((err, room) => {
                        if (err) {
                            console.error('(togglePublic)' +
                                'There was an error when saving the room');
                            console.error(err)
                        }
                        else {
                            io.sockets.in(roomId).emit('togglePublic');
                        }
                    });
                }
            });
        });
    });
}