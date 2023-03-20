module.exports = (io) => {
    const Room = require('../../models/room');
    io.on('connection', client => {
        //Update database and send back info
        client.on('changeRoomName', data => {
            Room.findById(data.roomId, async (err, room) => {
                if (err) {
                    console.error('(changeRoomName)' + err);
                }
                if (room) {
                    room.name = data.newRoomName;
                    room.save(err => {
                        if (err) {
                            console.error('(addToQueue) Error when saving room' + err);
                        }
                        else {
                            io.sockets.in(data.roomId).emit('updateRoomName', data.newRoomName);
                        }
                    });
                }
            });
        });
    });
}