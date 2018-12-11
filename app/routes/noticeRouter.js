const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const NoticeCtrl = require('../controllers/NoticeCtrl');

router.route('/search')
	.post(wrap(NoticeCtrl.searchNoticeByClubName)); // 새로운 출석 생성

module.exports = router;