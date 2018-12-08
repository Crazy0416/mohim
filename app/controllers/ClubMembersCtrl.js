'use strict';

const ClubMembersTable = require('../models/ClubMembersTable');

exports.addClubMember = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		clubName: req.body.clubName
	};

	try {
		[rows, fields] = await ClubMembersTable.addClubMember(dataObj);
	} catch (err) {
		logger.error("addClubMember 실패: %o", err); throw err;
	}

	res.json({
		"message": "클럽 가입 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows[0]
	});
};