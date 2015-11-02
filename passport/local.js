
var LocalStrategy   = require('passport-local').Strategy;
// Mongoose model
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

	var isValidPassword = function(user, password) {
		// compareSync(value, encrypted-hash)
		return bCrypt.compareSync(password, user.local.password);
	}

	// Generates hash using bCrypt
	var createHash = function(password) {
		// hashSync(data, salt)
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}


	// Sign up user
	 // instance of Local Authentication Strategy created using passport.use() function
	passport.use('signup', new LocalStrategy({
		//Allows to pass back the entire request to callback
		passReqToCallback : true
	},
	// Verify callback
	function(req, username, password, done) {

		findOrCreateUser = function() {
			// find user in Mongo with provided username
			 //Mongoose model query using MongoDB syntax
			User.findOne({ 'local.username' : username },
				function(err, user) {
					// If error
					if (err) {
						console.log('Error in Sign Up: ' + err);
						return done(err);
					}
					// If username already exists
					if (user) {
						console.log('User already exists' + username);
						return done(null, false, req.flash('message', 'User already exists'));
					} else {
					// No user with this username. Create user.
						// New instance of the user mongoose model
						var newUser = new User();
						//set user's local credentials
						newUser.local.username = username;
						newUser.local.password = createHash(password);
						newUser.local.email = req.param('email');
						newUser.local.firstName = req.param('firstName');
						newUser.local.lastName = req.param('lastName');

						// Save new user mongoose model
						newUser.save( function(err) {
							if (err) {
								console.log('Error in saving user: ' + err);
								throw err;
							}
							console.log('User Registration Successful');
							return done(null, newUser);
						});
					}
				});
		};
	  // Delay the execution of findOrCreateUser and execute 
	  // the method in the next tick of the event loop
		process.nextTick(findOrCreateUser);
	})
	);


	// First parameter is name used to identify the login strategy
	passport.use('login', new LocalStrategy({
		// allows access of request object in the callback
		// enables use of any parameters assosciated with the request
		passReqToCallback : true
	},
	// The verify callback for local auth accepts username and password args
	// They are submitted via the login form
	function(req, username, password, done) {
		// check in mongo if user with username exists
		User.findOne({ 'local.username' : username },
		 // returns one (user) document, which satisfies criteria
		 // passes it to the callback via done()
			function(err, user) {

				if (err) return done(err);

				// No document matching user account query returned from DB
				// Username doesn't exist, log error and redirect back
				if (!user) {
					console.log('User Not Found with username ' + username);
					return done(null, false, req.flash('message', 'User not found'));
				}

				// Document found for user account in DB. Verify password
				if (!isValidPassword(user, password)) {
					console.log('Invalid Password');
					return done(null, false, req.flash('message', 'Invalid Password'));
				}

				//Username and password match return user (success)
				 // 1st parameter null
				 // 2nd parameter truthy. Made available to request object
				return done(null, user);
			}
		);
	})
	);


}
