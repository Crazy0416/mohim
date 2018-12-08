const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const ClubCtrl = require('../controllers/ClubCtrl');

router.route('/make')
	.post(wrap(ClubCtrl.makeNewClub)); // 새로운 클럽 생성

router.route('/search')
	.get(wrap(ClubCtrl.viewClubAllList)); // 새로운 클럽 생성

module.exports = router;