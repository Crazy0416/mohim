'use strict';

const NoticeTable = require('../models/NoticeTable');
const config = require('../../config/config');
const moment = require('moment');

exports.makeNewNotice = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		clubName: req.body.clubName,
		title: req.body.title,
		content: req.body.content
	};

	try {
		[rows, fields] = await NoticeTable.makeNewNotice(dataObj);
	} catch (err) {
		logger.error("makeNewNotice 실패: %o", err); throw err;
	}

	res.json({
		"message": "공지 생성 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};
//
// exports.searchAttendByClubName = async(req, res, next) => {
// 	let [rows, fields] = [null, null];
// 	let dataObj = {
// 		clubName: req.body.clubName
// 	};
//
// 	try {
// 		[rows, fields] = await AttendTable.searchAttendByClubName(dataObj);
// 	} catch (err) {
// 		logger.error("searchAttendByClubName 실패: %o", err); throw err;
// 	}
//
// 	res.json({
// 		"message": "출석 검색 완료.",
// 		"code": 200,
// 		"time": new Date(),
// 		"data": rows
// 	});
// };