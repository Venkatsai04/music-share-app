module.exports = (io) => {
    const Room = require('../../models/room');
    io.on('connection', client => {
        //Update database and send back info
        client.on('sendTime', data => {
            Room.findById(data.roomId, async (err, room) => {
                if (!err && room) {
                    room.recentTime = data.date;
                    room.save((err, room) => {
                        if(err){
                            console.error('(storeDate) There was an error when saving the room');
                            console.error(err)
                        }
                    });
                }
            });
        });
    });
}