'use strict';

const AttendTable = require('../models/AttendTable');
const config = require('../../config/config');
const moment = require('moment');

exports.makeNewAttend = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		clubName: req.body.clubName,
		title: req.body.title,
		deadline: req.body.deadline,
		code: req.body.code
	};

	try {
		[rows, fields] = await AttendTable.makeNewAttend(dataObj);
	} catch (err) {
		logger.error("makeNewAttend 실패: %o", err); throw err;
	}

	res.json({
		"message": "출석 생성 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};

exports.searchAttendByClubName = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		clubName: req.body.clubName
	};

	try {
		[rows, fields] = await AttendTable.searchAttendByClubName(dataObj);
	} catch (err) {
		logger.error("searchAttendByClubName 실패: %o", err); throw err;
	}

	res.json({
		"message": "출석 검색 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};

exports.readAttend = async (req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		_id: req.body._id
	};

	try {
		[rows, fields] = await AttendTable.readAttend(dataObj);
	} catch (err) {
		logger.error("readAttend 실패: %o", err); throw err;
	}

	res.json({
		"message": "출석 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};

exports.finePenaltytoUnread = async (req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		clubName: req.body.clubName,
		_id: req.body._id
	};

	try {
		[rows, fields] = await AttendTable.finePenaltytoUnread(dataObj);
	} catch (err) {
		logger.error("finePenaltytoUnread 실패: %o", err); throw err;
	}

	// TODO: 코드가 지저분 하니 나중에 여유있을 때 바꿀것
	if(fields === 304) {
		res.json({
			"message": "이미 모두 출석하였습니다.",
			"code": 200,
			"time": new Date()
		});
		return;
	}
	res.json({
		"message": "벌금 부과 완료.",
		"code": 200,
		"time": new Date()
	});
};