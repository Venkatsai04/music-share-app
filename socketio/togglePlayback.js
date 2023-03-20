module.exports = (io) => {
    io.on('connection', client => {
        client.on('togglePlayback', data =>
            io.sockets.in(data.roomId).emit('togglePlayback', data.isPlaying));
    });
}
