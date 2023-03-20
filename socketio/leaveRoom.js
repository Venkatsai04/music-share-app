const Room = require('../../models/room');
let fetch = require('node-fetch');
let request = require('request');
require('dotenv').config();

module.exports = (io) => {
    io.on('connection', client => {
        client.on('leaveRoom', async (data) => {
            //A listener has left
            if (!data.isCreator) {
                //Get the id of the user that disconnected
                let userInfoRes = await fetch('https://api.spotify.com/v1/me', {
                    headers: { 'Authorization': 'Bearer ' + data.accessToken }
                });
                let userInfoResJSON = await userInfoRes.json();
                let userToRemoveURI = userInfoResJSON.uri;

                //Update database and return the new list of listeners
                //Remove the listener from the room
                Room.findById(data.roomId, (err, room) => {
                    if (err) { console.error('(leaveRoom) There was an error: ' + err); }
                    else {
                        if (room) {
                            //Use filter to remove the listener
                            let newListeners = room.roomListeners.filter(listener => listener.spotifyURI !== userToRemoveURI);
                            room.roomListeners = newListeners;
                            room.save((err, room) => {
                                if (err) { console.error('(leaveRoom) There was an error when saving: ' + err); }
                                else {
                                    if (room) {
                                        client.broadcast.to(data.roomId).emit('listenerLeft', {
                                            name: data.name,
                                            listeners: room.roomListeners
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
            //The creator has left
            else {
                Room.findById(data.roomId, (err, room) => {
                    if (err) { console.error('(leaveRoom) There was an error: ' + err); }
                    else {
                        if (room) {
                            //If the creator was the only person in the room, delete it
                            if (room.roomListeners.length === 0) {
                                Room.findByIdAndDelete(room._id, (err, room) => {
                                    if (err) { console.error('Error when deleting room: ' + err); }
                                });
                            }
                            else {
                                //There was at least one listener, promote them to creator
                                let oldestListener = room.roomListeners.shift();

                                //Get a new access token for the new creator
                                let authOptions = {
                                    url: 'https://accounts.spotify.com/api/token',
                                    form: {
                                        grant_type: 'refresh_token',
                                        refresh_token: oldestListener.refreshToken
                                    },
                                    headers: {
                                        'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
                                    },
                                    json: true
                                };

                                request.post(authOptions, function (error, response, body) {
                                    if (!error && response.statusCode === 200) {
                                        let newCreator = {
                                            name: oldestListener.name,
                                            spotifyURI: oldestListener.spotifyURI,
                                            pictureSrc: oldestListener.pictureSrc,
                                            accessToken: body.access_token,
                                            refreshToken: oldestListener.refreshToken,
                                        };
                                        room.creator = newCreator;
                                        room.save((err, room) => {
                                            if (err) { console.error('(leaveRoom) There was an error: ' + err); }
                                            else {
                                                if (room) {
                                                    //Tell the users that the original creator has left
                                                    client.broadcast.to(data.roomId).emit('creatorLeft', room);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        console.error('(leaveRoom) Error when updating token');
                                        console.error(error);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });
}