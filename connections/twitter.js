var passport = require('passport'),
	passportTwitter = require('passport-twitter'),
	TwitterStrategy = passportTwitter.Strategy,
	Usuario = require('../models/usuarios');
var twitterConnection = function (app) {
	passport.use(
		new TwitterStrategy(
		{
			consumerKey: 'opEb5yGFnHCUKQ55wVgP1SxK2',
			consumerSecret: 'IYR0n6gThF9ri7YGy2AJYjkkCwEchKewZW6yGeMIUBFJBTaZBr',
			callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
		},
		function (token, tokenSecret, profile, done) {
			Usuario.findOne({
				'twitter.id' : profile.id
			},
			function (err, user){
				if(err){
					return done(err);
				}
				if(!user){
					var usuario = new Usuario({
						username : profile.username,
						twitter : profile
					});
					var datos = JSON.stringify(eval("("+profile._raw+")"));
					usuario.nombre = JSON.parse(datos).name;
					usuario.save(function(err, user){
						if(err){
							done(err, null);
							return;
						}
						done(null, user);
					});
				}else{					
					return done(err, user);
				}
			});
		}
	));
	app.get('/auth/twitter',passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/inicio', failureRedirect: '/error' }));
};
module.exports = twitterConnection;