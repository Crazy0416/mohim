const express = require('express');
const router = express.Router();
const member = require('../models/UserSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
	let ip = (req && req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',').pop()) ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

    logger.info("Client Ip: %s", ip);
    res.json("동관이형 짱");
});
module.exports = router;
