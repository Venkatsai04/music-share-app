const mongoose = require('mongoose');
const shortestId = require('../server/shortestId');
const Schema = mongoose.Schema;

//The schema is how the model is defined conceptually
let roomSchema = new Schema({
	_id: {type: String, 'default':shortestId.generate},
	name: {type: String, required: false, max: 100},
	public: {type: Boolean},
	creator: {
		name: {type: String, required: true, max: 100},
		spotifyURI: {type: String, required: true},
		accessToken: {type: String, required: true},
		refreshToken: {type: String, required: true},
		pictureSrc: {type: String, required: false}
	},
	roomListeners: [{
		name: {type: String, required: true, max: 100},
		spotifyURI: {type: String, required: true},
		pictureSrc: {type: String, required: false},
		refreshToken: {type: String, required: true}
	}],
	upcomingSongs: [{
		name:{type: String, required:true},
		artist: {type:String, required:true},
		album: {type:String, required:true},
		spotifyURI: {type: String, required: true},
		albumArtSrc: {type: String, required: false}
	}],
	currentSong:{
		name:{type: String, required:true},
		artist: {type:String, required:true},
		album: {type:String, required:true},
		spotifyURI: {type: String, required: true},
		albumArtSrc: {type: String, required: false}
	},
	recentSongs:[{
		name:{type: String, required:true},
		artist: {type:String, required:true},
		album: {type:String, required:true},
		spotifyURI: {type: String, required: true},
		albumArtSrc: {type: String, required: false}
	}],
	recentTime: {type: Date, default: Date.now, required: true}
});

//Creating a model allows us to create a constructor
//from which we can then create actual rooms
module.exports = mongoose.model('Room', roomSchema);

