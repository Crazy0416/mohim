const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const UserCtrl = require('../controllers/UserCtrl');

router.route('/users/register')
	.post(wrap(UserCtrl.register)); // 회원가입

module.exports = router;