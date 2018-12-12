'use strict';

const PenaltyLogTable = require('../models/PenaltyLogTable');

exports.searchPenaltyLog = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {};
	if(req.body.user)
		dataObj.user = req.body.user;
	else if(req.body.clubName)
		dataObj.clubName = req.body.clubName;

	try {
		[rows, fields] = await PenaltyLogTable.searchPenaltyLog(dataObj);
	} catch (err) {
		logger.error("searchPenaltyLog 실패: %o", err); throw err;
	}

	res.json({
		"message": "로그 검색 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};