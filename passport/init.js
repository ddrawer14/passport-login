
var login = require('./login');
var User = require('../models/user');

module.exports = function(passport) {

	// {Se/De}serialize user instance from session store to support persistent login sessions
	 //Subsequent request won't contain user credentials
	passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

	passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });


	login(passport);

}