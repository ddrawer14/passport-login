var mongoose = require('mongoose');

//Mongoose model and schema
module.exports = mongoose.model('User', {
	local : {
		id: String,
		username: String,
		password: String,
		email: String,
		firstName: String,
		lastName: String
	}, 
	fb : {
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		email: String
	},
	twitter : {
		id: String,
		token: String,
		username: String,
		displayName: String,
		lastStatus: String
	}

});
