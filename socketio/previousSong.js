const Room = require('../../models/room');

module.exports = (io) => {
    io.on('connection', client => {
        //Update database and send back info
        client.on('prevSong', roomId => {
            Room.findById(roomId, async (err, room) => {
                if (!err) {
                    //Then we can remove a song
                    if (room.recentSongs.length >= 1) {

                        //Add the current song to the beginning of the 
                        //upcomingSongs array
                        room.upcomingSongs.unshift(room.currentSong);

                        //Remove the most recently played song from the array
                        room.currentSong = room.recentSongs.pop();

                        let recentSongs = room.recentSongs;
                        let currentSong = room.currentSong;
                        let upcomingSongs = room.upcomingSongs;

                        room.save(err => {
                            if (err) {
                                console.log('(addToQueue) Error when going to the previous song');
                            }
                            else {
                                io.sockets.in(roomId).emit('newRoomInfo', {
                                    success: true,
                                    previousSongs: recentSongs,
                                    currentSong: currentSong,
                                    nextSongs: upcomingSongs
                                });
                            }
                        });
                    }
                    else {
                        console.log('no recent songs to remove');
                    }
                }
            });
        });
    });
}