const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const UserCtrl = require('../controllers/UserCtrl');
const AttendCtrl = require('../controllers/AttendCtrl');

router.route('/register')
	.post(wrap(UserCtrl.register)); // 회원가입

router.route('/login')
	.post(wrap(UserCtrl.login));    // 로그인

router.route('/clubs')
	.post(wrap(UserCtrl.viewUserClubList));    // 가입된 클럽 목록 가져오기

router.route('/cyberMoney')
	.put(wrap(UserCtrl.chargeCyberMoney));    // 사이버 머니 충전하기

router.route('/attend/make')
	.post(wrap(AttendCtrl.makeNewAttend));    // 새 공지 생성


module.exports = router;