const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const PenaltyLogCtrl = require('../controllers/PenaltyLogCtrl');

router.route('/penalty/search')
	.post(wrap(PenaltyLogCtrl.searchPenaltyLog)); // 로그 검색 방식 1. email 2. clubName

module.exports = router;