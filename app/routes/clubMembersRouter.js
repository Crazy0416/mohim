const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const ClubMembersCtrl = require('../controllers/ClubMembersCtrl');

router.route('/add')
	.put(wrap(ClubMembersCtrl.addClubMember)); // 클럽 가입 요청

module.exports = router;