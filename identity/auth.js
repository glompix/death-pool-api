var http = require('request');

// test credentials by default, otherwise environmental if provided. (e.g. heroku settings)
var conf = {
	appId: process.env.FACEBOOK_APPID || '1612780269045855',
	appSecret: process.env.FACEBOOK_APPSECRET || '18a9872e20dd9348230b57de9d73d48a'
}

function facebookAccessToken(callback) {
	request({
		url: 'https://graph.facebook.com/oauth/access_token',
		qs: {
			client_id: conf.appId,
			client_secret: conf.appSecret,
			grant_type: 'client_credentials'
		}
	}, function(error, response, body) {
		var accessToken;
		if (!error && response.statusCode == 200) {
			var match = body.match('access_token=(.*)$');
			if (match && match[1]) {
				accessToken = match[1];
			}
		}
		callback(error, accessToken);
	});
}

function facebookAuth(req, callback) {
	facebookAccessToken(function(error, accessToken) {
		if (!error && accessToken) {
			request({
				url: 'https://graph.facebook.com/debug_token',
				qs: {
					input_token: req.auth.facebook.token,
					access_token: accessToken
				}
			}, function(error, response, body) {
				var isAuthenticated = false;
				if (!error && response.statusCode == 200) {
					isAuthenticated = body.data.is_valid && body.data.user_id === req.auth.facebook.id;
				}
				callback(error, isAuthenticated);
			});
		}
	});
}

module.exports = function(req, res, next) {
	if (req.body.auth) {
		req.authenticated = false;
		if (req.body.auth.facebook) {
			facebookAuth(req, function (error, isAuthenticated) {
				req.authenticated = isAuthenticated;
			});
		} else {
			res.sendStatus(401);
			next();
		}
	} else {
		next();
	}
}
