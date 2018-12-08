'use strict';

const ClubTable = require('../models/ClubTable');
const to = require('await-to-js').default;

exports.makeNewClub = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		clubName: req.body.clubName,
		clubInfo: req.body.clubInfo
	};

	try {
		[rows, fields] = await ClubTable.makeNewClub(dataObj);
	} catch (err) {
		logger.error("makeNewClub 실패: %o", err); throw err;
	}

	res.json({
		"message": "클럽 생성 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows[0]
	});
};

exports.viewClubList = async (req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		page: req.params.page || 0
	};

	try {
		[rows, fields] = await ClubTable.viewClubList(dataObj);
	} catch (err) {
		logger.error("viewClubList 실패: %o", err); throw err;
	}

	res.json({
		"message": "클럽 목록 검색 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};