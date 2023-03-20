module.exports = (io) => {
    io.on('connection', client => {
        //console.log('client connected with id: ' + client.id);

        client.on('createRoom', (roomId) => {
            client.join(roomId);
            io.sockets.in(roomId).emit('roomCreated', 'The room ' + roomId + ' is created');
        });

        client.on('joinRoom', (data) => {
            let roomId = data.roomId;
            client.join(roomId);
            //Only tell the people already in the room about the new listener
            client.broadcast.to(roomId).emit('listenerJoined', data.name);
        });

        client.on('initUpdateSongs', (data) => {
            io.sockets.in(data.roomId).emit('updateSongs', data);
            //Tell the other users that a user added a song
            io.in(data.roomId).emit('alertNewInfo', data.message);
        });

        //client.on('disconnect', (reason) =>
          //  console.log('Client ' + client.id + ' disconnected'));
    });
}