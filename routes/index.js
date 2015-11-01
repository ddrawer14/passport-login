
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}


//Takes instance of Passport created in app.js
module.exports = function(passport) {

	/* GET home page. */
	router.get('/', function(req, res) {
	  res.render('index', { message: req.flash('message') });
	});

	/* Handle logint POST request*/
	 // Request parameters include username and password inputted to form
	 // They are passed to passport's local "login" authentication method
	router.post('/login', passport.authenticate('login', {
		successRedirect : '/home',
		failureRedirect : '/',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res) {
		res.render('register', { message : req.flash('message') });
	});

	/* Handle REgistration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
	    failureRedirect: '/signup',
	    failureFlash : true
	}))

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	router.get('/fb', isAuthenticated, function(req, res) {
		res.render('fb', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook',
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/fb',
			failureRedirect : '/'
		})
	);


	return router;
}
