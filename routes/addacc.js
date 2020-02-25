const express = require('express');
const twitterAPI = require('node-twitter-api');
const session = require('express-session');

const router = express.Router();

router.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/formsubmit', (req, res) => {
	req.session.consumer = req.query.consumer.replace(/\s+/g, '');
	req.session.secret = req.query.secret.replace(/\s+/g, '');
	res.redirect('/add');
});

router.get('/', (req, res) => {
	const twitter = new twitterAPI({
		consumerKey: req.session.consumer,
		consumerSecret: req.session.secret,
		callback: 'http://127.0.0.1:5000/add/'
	});

	if (!req.query.oauth_token || !req.query.oauth_verifier) {
		twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
			if (error) {
				console.log('Error getting OAuth request token : ' + error);
				res.redirect('/?err=oautherror');
			} else {
				req.session.requestTokenSecret = requestTokenSecret;
				res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
			}
		});
	} else {
		twitter.getAccessToken(
			req.query.oauth_token,
			req.session.requestTokenSecret,
			req.query.oauth_verifier,
			function(error, accessToken, accessTokenSecret, results) {
				if (error) {
					console.log(error);
				} else {
					req.session.destroy(function(err) {
						twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) {
							if (error) {
								console.log('there was error :(');
							} else {
								res.redirect(
									`/details?username=${data.screen_name}&access=${accessToken}&accesssecret=${accessTokenSecret}`
								);
							}
						});
					});
				}
			}
		);
	}
});

module.exports = router;
