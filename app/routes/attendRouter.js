const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const AttendCtrl = require('../controllers/AttendCtrl');
//
// router.route('/make')
// 	.post(wrap(AttendCtrl.makeNewAttend)); // 새로운 출석 생성

module.exports = router;