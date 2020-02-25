const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { err: req.query.err });
});

router.get('/details', (req, res) => {
	if (req.query.username && req.query.access && req.query.accesssecret) {
		res.render('details', {
			username: req.query.username,
			access: req.query.access,
			secret: req.query.accesssecret
		});
	} else {
		res.redirect('/?err=error');
	}
});

module.exports = router;
