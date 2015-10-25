var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) { 

	// First parameter is name used to identify the login strategy
	passport.use('login', new LocalStrategy({
		// allows access of request object in the callback
		// enables use of any parameter assosciated with the request
		passReqToCallback : true
	},
	function(req, username, password, done) {
		// check in mongo if user with username exists
		User.findOne({ 'username' : username }, 
			
			function(err, user) {
				
				if (err) return done(err);

				// Username doesn't exist, log error and redirect back
				if (!user) {
					console.log('User Not Found with username ' + username);
					return done(null, false, req.flash('message', 'User not found'));
				}

				if (!isValidPassword(user, password)) {
					console.log('Invalid Password');
					return done(null, false,
						req.flash('message', 'Invalid Password'));
				}

				//Username and password match return user (success)
				 // 1st parameter nuull
				 // 2nd parameter truthy. Made available to request object
				return done(null, user);
			}
		);
	})
	);

	var isValidPassword = function(user, password) {
		return bCrypt.compareSync(password, user.password);
	}

	// Sign up user
	passport.use('signup', new LocalStrategy({
		//Allows to pass back the entire request to callback
		passReqToCallback : true
	}, 
	function(req, username, password, done) {
		findOrCreateUser = function() {
			// find user in Mongo with provided username
			User.findOne({ 'username' : username }, 			
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
						var newUser = new User();
						//set user's local credentials
						newUser.username = username;
						newUser.password = createHash(password);
						newUser.email = req.param('email');
						newUser.firstName = req.param('firstName');
						newUser.lastName = req.param('lastName');

						// Save user
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
		process.nextTick(findOrCreateUser);
	})
	);

	// Generates hash using bCrypt
	var createHash = function(password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}

}