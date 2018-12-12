'use strict';

const config = require('../../config/config');
const poolCon = require('../helpers/mysqlHandler');
const moment = require('moment');

module.exports = {
	selectPenaltyLogByEmailSQL: `SELECT * FROM PenaltyLog WHERE u_email = ?`,
	selectPenaltyLogByClubNameSQL: `SELECT * FROM PenaltyLog WHERE c_club_name = ?`,
	searchPenaltyLog: async function(dataObj) {
		if(!(dataObj && (dataObj.user instanceof Object && dataObj.user.email || dataObj.clubName))) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			if(dataObj.user && dataObj.user.email)
				[rows,fields] = await connection.execute(this.selectPenaltyLogByEmailSQL, [dataObj.user.email]);
			else if (dataObj.clubName)
				[rows,fields] = await connection.execute(this.selectPenaltyLogByClubNameSQL, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 로그 검색 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("searchPenaltyLog 찾는 형식: %o, 검색 결과: %o",dataObj, rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	}
};