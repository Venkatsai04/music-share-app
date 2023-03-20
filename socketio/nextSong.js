const fetch = require('node-fetch');
const Room = require('../../models/room');
let querystring = require('querystring');

module.exports = (io) => {
    io.on('connection', client => {
        //Update database and send back info
        client.on('nextSong', roomId => {
            Room.findById(roomId, async (err, room) => {
                if (err) { console.error('(nextSong) There was an error when finding the room.'); }
                else {
                    //Add the song that just finished to the recent songs queue
                    room.recentSongs.push(room.currentSong);
                    //If there is an upcoming song to play
                    let user = '';
                    if (room.upcomingSongs.length >= 1) {
                        room.currentSong = room.upcomingSongs.shift();
                    }
                    //There is no upcoming song, get recommendatiom from Spotify
                    else {
                        user = 'Syncify';
                        let seed_tracks = [];
                        //Since we are storing Spotify uris which contain
                        //spotify:track:, we need to remove this to get the i
                        let songArr = room.currentSong.spotifyURI.split(':');
                        seed_tracks.push(songArr[2]);
                        let recentSeedTracks = room.recentSongs.slice(-4, room.recentSongs.length);
                        recentSeedTracks.forEach(song => {
                            if (seed_tracks.length < 5) {
                                songArr = song.spotifyURI.split(':');
                                seed_tracks.push(songArr[2]);
                            }
                        });
                        let recommendationsRes = await fetch('https://api.spotify.com/v1/recommendations?' +
                            querystring.stringify({
                                limit: '1',
                                seed_tracks: seed_tracks,
                                min_popularity: '50'
                            }), {
                                headers: { 'Authorization': 'Bearer ' + room.creator.accessToken }
                            });
                        let recommendationsJSON = await recommendationsRes.json();

                        let artists = '';
                        if (recommendationsJSON.tracks.length >= 1) {
                            recommendationsJSON.tracks[0].artists.forEach((artist, i) => {
                                i === 0 ? artists += artist.name :
                                    artists += ', ' + artist.name;
                            });
                            let spotifyRecommendedSong = {
                                name: recommendationsJSON.tracks[0].name,
                                artist: artists,
                                album: recommendationsJSON.tracks[0].album.name,
                                spotifyURI: recommendationsJSON.tracks[0].uri,
                                albumArtSrc: recommendationsJSON.tracks[0].album.images[0].url
                            }
                            room.currentSong = spotifyRecommendedSong;
                        }
                        //If Spotify could not find a recommended song
                        else {
                            console.error('There was an error getting the recommended song');
                            console.log('We will add S.O.S. by Avicii since there were no recommendations');
                            room.currentSong = {
                                "name": "SOS"
                                , "artist": "Avicii, Aloe Blacc",
                                "album": "SOS",
                                "spotifyURI": "spotify:track:6nDKrPlXdpomGBgAlO7UdP",
                                "albumArtSrc": "https://i.scdn.co/image/2cc4d3aa28ebae67ed93040315342ca43aa7080d"
                            };
                        }
                        //End Spotify suggestion section
                    }

                    room.save((err, room) => {
                        if (err) {
                            console.error('(nextSong) Error when saving room');
                            console.error(err);
                        }
                        else {
                            if (room) {
                                io.sockets.in(roomId).emit('newRoomInfo', {
                                    success: true,
                                    previousSongs: room.recentSongs,
                                    currentSong: room.currentSong,
                                    nextSongs: room.upcomingSongs,
                                    user: user
                                });
                            }
                        }
                    });
                }
            });
        });
    });
}