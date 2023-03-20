module.exports = (io) => {
    const Room = require('../../models/room');

    io.on('connection', client => {
        //Update database and send back info
        client.on('toggleShuffle', roomId => {
            Room.findById(roomId, async (err, room) => {
                if (err) {
                    console.error(err);
                }
                if(room){
                    console.log('toggleShuffle was called for room ' + roomId);
                }
            });
        });
    });
}