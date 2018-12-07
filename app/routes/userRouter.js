const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const UserCtrl = require('../controllers/UserCtrl');

router.route('/register')
	.post(wrap(UserCtrl.register)); // 회원가입

router.route('/login')
	.post(wrap(UserCtrl.login));    // 로그인
module.exports = router;